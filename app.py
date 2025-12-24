#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
TalentIQ Hybrid Scorer - Streamlit + LLM + Core Logic (upload-only, JD suggestions)

Run:
    streamlit run app.py
"""

import os
import re
import json
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

import tempfile
from pathlib import Path   # you probably already have this

import streamlit as st

# ===========================
# 0) LLM CLIENT (OpenAI-style)
# ===========================
try:
    import openai
    openai.api_key = os.getenv("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", "")
    LLM_ENABLED = bool(openai.api_key)
except ImportError:
    openai = None
    LLM_ENABLED = False

# ===========================
# 1) PDF TEXT LOADER
# ===========================
def load_pdf_text(path: str) -> str:
    """
    Minimal PDF text extraction using pdfminer.six if available.
    Falls back to PyPDF2 if pdfminer isn't installed.
    """
    try:
        from pdfminer.high_level import extract_text
        return extract_text(path) or ""
    except Exception:
        try:
            import PyPDF2
            txt = []
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for p in reader.pages:
                    t = p.extract_text() or ""
                    txt.append(t)
            return "\n".join(txt)
        except Exception as e:
            raise RuntimeError(
                "Unable to extract text from PDF. Install pdfminer.six or PyPDF2."
            ) from e

# ============================================================
# 2) JD → CONFIG (role, weights, taxonomy, aliases)
# ============================================================
DEFAULT_ROLE_WEIGHTS: Dict[str, Dict[str, float]] = {
    "frontend": {"frameworks": .35, "state_mgmt": .20, "perf_a11y": .20, "testing": .15, "build_deploy": .10},
    "backend":  {"databases": .25, "backend_langs": .25, "cloud": .20, "infra_tooling": .15, "testing": .10, "observability": .05},
    "data_science": {"python_ds": .25, "ml": .25, "data_eng": .20, "experimentation": .15, "viz_comm": .10, "cloud": .05},
    "product": {"discovery": .25, "delivery": .25, "analytics": .20, "tech_fluency": .15, "stakeholders": .15},
}

DEFAULT_TAXONOMY: Dict[str, Dict[str, List[str]]] = {
    "frontend": {
        "frameworks": ["react", "react.js", "reactjs", "next.js", "nextjs", "vue", "angular"],
        "state_mgmt": ["redux", "zustand", "mobx", "context api"],
        "perf_a11y": ["lighthouse", "web vitals", "a11y", "accessibility", "wcag", "aria"],
        "testing": ["jest", "cypress", "rtl", "testing library", "playwright"],
        "build_deploy": ["webpack", "vite", "vercel", "netlify", "ci/cd", "cicd"],
    },
    "backend": {
        "databases": ["postgres", "postgresql", "mysql", "mariadb", "mongodb", "redis", "cassandra", "dynamodb", "snowflake"],
        "backend_langs": ["python", "fastapi", "django", "flask", "java", "spring", "go", "golang", "node", "express", "kotlin", "scala"],
        "cloud": ["aws", "gcp", "azure", "ecs", "eks", "gke", "lambda", "cloud run"],
        "infra_tooling": ["docker", "kubernetes", "terraform", "ansible", "github actions", "argo", "ci/cd", "cicd"],
        "testing": ["unit test", "pytest", "junit", "integration test", "e2e", "end to end"],
        "observability": ["prometheus", "grafana", "datadog", "sentry", "otel", "opentelemetry", "logs", "traces", "metrics"],
    },
    "data_science": {
        "python_ds": ["python", "pandas", "numpy", "scikit", "sklearn", "matplotlib"],
        "ml": ["xgboost", "lightgbm", "pytorch", "tensorflow", "nlp", "cv", "transformer"],
        "data_eng": ["sql", "spark", "airflow", "dbt", "kafka"],
        "experimentation": ["ab test", "a/b", "experiment", "causal"],
        "viz_comm": ["tableau", "powerbi", "plotly", "deck"],
        "cloud": ["aws", "gcp", "sagemaker", "databricks"],
    },
    "product": {
        "discovery": ["user research", "interview", "insights"],
        "delivery": ["roadmap", "backlog", "agile", "scrum"],
        "analytics": ["sql", "amplitude", "mixpanel", "ga4"],
        "tech_fluency": ["api", "architecture", "aws", "gcp"],
        "stakeholders": ["communication", "collaboration", "alignment"],
    },
}

DEFAULT_ALIASES = {
    "react.js": ["react", "reactjs"],
    "next.js": ["next", "nextjs"],
    "ci/cd": ["cicd", "continuous integration", "continuous delivery", "ci", "cd"],
    "web vitals": ["core web vitals", "web-vitals"],
    "testing library": ["@testing-library", "rtl"],
    "a11y": ["accessibility"],
    "wcag": ["wcag2", "wcag 2.1"],
    "aria": ["aria-label", "aria roles"],
    "node": ["nodejs", "node.js"],
    "golang": ["go"],
    "postgresql": ["postgres"],
}

ROLE_HINTS = {
    "frontend": ["frontend", "front-end", "ui engineer", "web developer", "react", "next.js", "vue", "angular", "redux", "a11y", "wcag", "aria", "lighthouse"],
    "backend":  ["backend", "back-end", "api", "microservices", "java", "spring", "python", "django", "fastapi", "go", "golang", "node", "postgres", "mysql", "redis", "kubernetes", "docker"],
    "data_science": ["data scientist", "data science", "ml", "machine learning", "modeling", "pytorch", "tensorflow", "xgboost", "pandas", "sql", "experiment", "ab test", "causal"],
    "product": ["product manager", "product management", "discovery", "roadmap", "backlog", "stakeholder", "analytics", "mixpanel", "amplitude"],
}

def _tokenize_lower(text: str) -> List[str]:
    return re.findall(r"[a-z0-9\.\+#/\-]+", text.lower())

def infer_role(jd_text: str) -> str:
    t = jd_text.lower()
    scores = {}
    for role, hints in ROLE_HINTS.items():
        scores[role] = sum(t.count(h) for h in hints)
    role = max(scores.items(), key=lambda kv: kv[1])[0]
    if all(v == 0 for v in scores.values()):
        role = "frontend"
    return role

def _area_hit_counts(role: str, jd_text: str, taxonomy: Dict[str, Dict[str, List[str]]]) -> Dict[str, int]:
    t = jd_text.lower()
    counts = {}
    for area, skills in taxonomy[role].items():
        c = 0
        for s in skills:
            c += t.count(s.lower())
        counts[area] = c
    return counts

def _normalize_weights(counts: Dict[str, int], default: Dict[str, float], blend: float = 0.6) -> Dict[str, float]:
    if not counts:
        return default.copy()
    total_hits = sum(counts.values())
    if total_hits == 0:
        return default.copy()
    freq = {k: (v / total_hits) for k, v in counts.items()}
    mixed = {k: blend * freq.get(k, 0.0) + (1.0 - blend) * default.get(k, 0.0) for k in default}
    s = sum(mixed.values()) or 1.0
    return {k: v / s for k, v in mixed.items()}

def _expand_aliases_from_jd(jd_text: str, base_aliases: Dict[str, List[str]]) -> Dict[str, List[str]]:
    aliases = {k.lower(): list({*v}) for k, v in base_aliases.items()}
    toks = set(_tokenize_lower(jd_text))

    def add_alias(canon: str, *candidates: str):
        canon = canon.lower()
        if canon not in aliases:
            aliases[canon] = []
        for c in candidates:
            if c and c.lower() not in aliases[canon]:
                aliases[canon].append(c.lower())

    if "node.js" in toks or "nodejs" in toks or "node" in toks:
        add_alias("node", "node.js", "nodejs", "node")
    if "go" in toks or "golang" in toks:
        add_alias("golang", "go", "golang")
    if "postgres" in toks or "postgresql" in toks:
        add_alias("postgresql", "postgres", "postgresql")
    if "react" in toks or "reactjs" in toks or "react.js" in toks:
        add_alias("react.js", "react", "reactjs")
    if "next" in toks or "nextjs" in toks or "next.js" in toks:
        add_alias("next.js", "next", "nextjs")
    if "ci" in toks or "cd" in toks or "cicd" in toks or "ci/cd" in toks:
        add_alias("ci/cd", "ci", "cd", "cicd", "continuous integration", "continuous delivery")
    if "accessibility" in toks or "a11y" in toks:
        add_alias("a11y", "accessibility", "a11y")
    if "wcag" in toks or "wcag2" in toks or "wcag 2.1" in " ".join(toks):
        add_alias("wcag", "wcag", "wcag 2.1", "wcag2")
    if "aria" in toks or "aria-label" in toks:
        add_alias("aria", "aria", "aria-label", "aria roles")
    if "web" in toks and "vitals" in toks:
        add_alias("web vitals", "web vitals", "core web vitals", "web-vitals")

    for k in list(aliases.keys()):
        aliases[k] = sorted(list({a.lower() for a in aliases[k] if a.strip()}))
    return aliases

def _focus_taxonomy(role: str, jd_text: str, taxonomy: Dict[str, Dict[str, List[str]]], keep_at_least: int = 2) -> Dict[str, Dict[str, List[str]]]:
    t = jd_text.lower()
    focused: Dict[str, Dict[str, List[str]]] = {role: {}}
    for area, skills in taxonomy[role].items():
        hits = [s for s in skills if s.lower() in t]
        if len(hits) >= keep_at_least:
            focused[role][area] = sorted(list({*hits}))
        else:
            extras = [s for s in skills if s not in hits][:max(0, keep_at_least - len(hits))]
            focused[role][area] = sorted(list({*hits, *extras}))
    return focused

def config_from_jd(jd_text: str) -> Tuple[str, Dict[str, Dict[str, float]], Dict[str, Dict[str, List[str]]], Dict[str, List[str]]]:
    role = infer_role(jd_text)
    counts = _area_hit_counts(role, jd_text, DEFAULT_TAXONOMY)
    role_weights = DEFAULT_ROLE_WEIGHTS[role]
    derived_weights = _normalize_weights(counts, role_weights, blend=0.6)
    focused_tax = _focus_taxonomy(role, jd_text, DEFAULT_TAXONOMY, keep_at_least=2)
    aliases = _expand_aliases_from_jd(jd_text, DEFAULT_ALIASES)
    final_role_weights = {role: derived_weights}
    final_taxonomy = focused_tax
    final_aliases = aliases
    return role, final_role_weights, final_taxonomy, final_aliases

# Current run-time config (will be overwritten per JD)
ROLE_WEIGHTS: Dict[str, Dict[str, float]] = DEFAULT_ROLE_WEIGHTS.copy()
TAXONOMY: Dict[str, Dict[str, List[str]]] = DEFAULT_TAXONOMY.copy()
ALIASES = DEFAULT_ALIASES.copy()

# ===========================
# 3) SCORING DATA STRUCTURES
# ===========================
THETA = {
    "frontend": {"frameworks": .65, "state_mgmt": .60, "perf_a11y": .60, "testing": .50, "build_deploy": .50},
    "backend":  {"databases": .60, "backend_langs": .65, "cloud": .55, "infra_tooling": .50, "testing": .45, "observability": .40},
    "data_science": {"python_ds": .60, "ml": .60, "data_eng": .55, "experimentation": .45, "viz_comm": .45, "cloud": .40},
    "product": {"discovery": .60, "delivery": .60, "analytics": .55, "tech_fluency": .50, "stakeholders": .55},
}

NEGATIONS = ["no ", "not ", "without ", "lack of ", "beginner", "basic", "exposed to", "familiarity with"]

@dataclass
class SkillItem:
    name: str
    level_hint: str = "intermediate"
    last_used: Optional[str] = None
    years_hint: Optional[float] = None
    evidence_snippets: List[str] = field(default_factory=list)

@dataclass
class ResumeStruct:
    identity: Dict[str, List[str]]
    roles: List[Dict[str, Optional[str]]]
    skills: List[SkillItem]
    tools: List[Dict[str, Optional[str]]] = field(default_factory=list)
    education: List[Dict[str, str]] = field(default_factory=list)
    raw_text: str = ""

class Canonicalizer:
    def __init__(self, alias_map: Dict[str, List[str]]):
        self.alias2canon = {}
        for canon, aliases in alias_map.items():
            self.alias2canon[canon.lower()] = canon.lower()
            for a in aliases:
                self.alias2canon[a.lower()] = canon.lower()

    def canon(self, token: str) -> str:
        t = token.strip().lower()
        return self.alias2canon.get(t, t)

# ===========================
# 4) LLM EXTRACTORS
# ===========================
def llm_extract_resume(pdf_text: str, enabled: bool) -> Optional[ResumeStruct]:
    """
    LLM resume parser. If `enabled` is False or LLM not configured, returns None.
    """
    if not enabled or not LLM_ENABLED:
        return None
    if not pdf_text or len(pdf_text.strip()) < 50:
        return None

    system_prompt = """
You are a resume parser for a hiring scoring engine.
Return STRICT JSON with this schema:

{
  "identity": {
    "name": ["Full Name"],
    "emails": ["email@example.com"]
  },
  "roles": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "start": "YYYY-MM",
      "end": "YYYY-MM or "present""
    }
  ],
  "skills": [
    {
      "name": "react",
      "level_hint": "beginner|intermediate|advanced",
      "last_used": "YYYY-MM or null",
      "years_hint": 2.5,
      "evidence_snippets": [
        "short snippet from the resume where this skill is mentioned"
      ]
    }
  ],
  "education": [
    {
      "degree": "BS in Computer Science",
      "institution": "University Name",
      "year": "YYYY"
    }
  ]
}

Only JSON, no explanation.
If unsure, make best-effort guesses.
""".strip()

    user_prompt = f"""
Here is a resume. Parse it into the requested schema.

RESUME:
\"\"\"{pdf_text[:16000]}\"\"\"
"""

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0,
        )
        raw_json = resp["choices"][0]["message"]["content"]
        data = json.loads(raw_json)

        identity = data.get("identity", {"name": ["Unknown"], "emails": []})
        roles = data.get("roles", [])
        education = data.get("education", [])
        skills_raw = data.get("skills", [])

        skills: List[SkillItem] = []
        for s in skills_raw:
            skills.append(
                SkillItem(
                    name=s.get("name", "").strip(),
                    level_hint=s.get("level_hint", "intermediate"),
                    last_used=s.get("last_used"),
                    years_hint=s.get("years_hint"),
                    evidence_snippets=s.get("evidence_snippets", [])[:3],
                )
            )

        return ResumeStruct(
            identity=identity,
            roles=roles,
            skills=skills,
            education=education,
            raw_text=pdf_text,
        )
    except Exception as e:
        print(f"[warn] LLM resume parse failed: {e}")
        return None

def regex_extract_resume(pdf_text: str, role: str, canon: Canonicalizer) -> ResumeStruct:
    """
    Regex fallback: scan for known taxonomy skills, create SkillItems with snippets.
    """
    text = pdf_text or ""
    lowered = text.lower()
    tokens = set()

    all_skills = set()
    for r, areas in TAXONOMY.items():
        for _, skills in areas.items():
            for s in skills:
                all_skills.add(s.lower())

    def snippets_for(term: str, window=50) -> List[str]:
        out = []
        for m in re.finditer(re.escape(term.lower()), lowered):
            start = max(0, m.start() - window)
            end = min(len(lowered), m.end() + window)
            out.append("…" + lowered[start:end].replace("\n", " ") + "…")
            if len(out) >= 3:
                break
        return out

    skills: List[SkillItem] = []
    for s in sorted(all_skills):
        if s in lowered:
            can = canon.canon(s)
            if can not in tokens:
                tokens.add(can)
                skills.append(
                    SkillItem(
                        name=can,
                        level_hint="intermediate",
                        last_used=None,
                        years_hint=None,
                        evidence_snippets=snippets_for(s),
                    )
                )

    ident = {"name": ["Unknown"], "emails": []}
    roles = []
    return ResumeStruct(identity=ident, roles=roles, skills=skills, raw_text=text)

def extract_resume_struct(pdf_text: str, role: str, canon: Canonicalizer, use_llm: bool) -> ResumeStruct:
    parsed = llm_extract_resume(pdf_text, enabled=use_llm)
    if parsed is not None:
        canon_skills = []
        for s in parsed.skills:
            canon_skills.append(
                SkillItem(
                    name=canon.canon(s.name),
                    level_hint=s.level_hint,
                    last_used=s.last_used,
                    years_hint=s.years_hint,
                    evidence_snippets=s.evidence_snippets[:3],
                )
            )
        parsed.skills = canon_skills
        parsed.raw_text = pdf_text
        return parsed
    return regex_extract_resume(pdf_text, role, canon)

# ===========================
# 5) SCORING FUNCTIONS
# ===========================
LEVEL_MAP = {"beginner": 0.3, "intermediate": 0.6, "advanced": 1.0}

def recency_score(last_used: Optional[str]) -> float:
    return 1.0  # hook for future

def evidence_score(snips: List[str]) -> float:
    return min(1.0, len(snips) / 3.0)

def depth(skill: SkillItem) -> float:
    lvl = LEVEL_MAP.get(skill.level_hint, 0.6)
    evd = evidence_score(skill.evidence_snippets)
    rcy = recency_score(skill.last_used)
    return 0.4 * lvl + 0.3 * evd + 0.3 * rcy

def negation_penalty(text: str) -> float:
    t = text.lower()
    hits = sum(t.count(kw) for kw in NEGATIONS)
    return max(0.85, 1.0 - 0.03 * hits)

def jd_demand_from_text(role: str, jd_text: str) -> Dict[str, float]:
    base = ROLE_WEIGHTS[role].copy()
    if role == "frontend" and len(re.findall(r"\b(accessibility|wcag|aria|a11y)\b", jd_text.lower())) >= 3:
        base["perf_a11y"] = 0.30
        s = sum(base.values())
        for k in base:
            base[k] = base[k] / s
    return base

def supply_by_area(role: str, resume: ResumeStruct) -> Dict[str, float]:
    areas = TAXONOMY[role]
    index: Dict[str, List[str]] = defaultdict(list)
    for area, skills in areas.items():
        for s in skills:
            index[s.lower()].append(area)

    bucket: Dict[str, List[float]] = defaultdict(list)
    for sk in resume.skills:
        key = sk.name.lower()
        if key in index:
            d = depth(sk)
            for area in index[key]:
                bucket[area].append(d)

    out = {}
    for area in areas.keys():
        vals = sorted(bucket.get(area, []))
        if not vals:
            out[area] = 0.0
        else:
            mid = len(vals) // 2
            out[area] = vals[mid] if len(vals) % 2 == 1 else 0.5 * (vals[mid - 1] + vals[mid])
    return out

def left_to_right(role: str, jd_text: str, resume: ResumeStruct) -> Tuple[float, Dict[str, float], Dict[str, float]]:
    D = jd_demand_from_text(role, jd_text)
    S = supply_by_area(role, resume)
    theta = THETA[role]
    cov_by_area, norm_supply = {}, {}
    for a in D:
        norm = S.get(a, 0.0) / max(1e-9, theta[a])
        cov = min(1.0, norm)
        cov_by_area[a] = cov
        norm_supply[a] = norm
    l2r = 100.0 * sum(D[a] * cov_by_area[a] for a in D)
    return round(l2r, 1), cov_by_area, norm_supply

def right_to_left(role: str, jd_text: str, resume: ResumeStruct) -> float:
    jd_skillset = set()
    for skills in TAXONOMY[role].values():
        for s in skills:
            jd_skillset.add(s.lower())

    num, den = 0.0, 0.0
    for sk in resume.skills:
        d = depth(sk)
        den += d
        if sk.name.lower() in jd_skillset:
            num += d
    if den == 0:
        return 0.0
    return round(100.0 * num / den, 1)

def technical(role: str, resume: ResumeStruct) -> float:
    weights = ROLE_WEIGHTS[role]
    S = supply_by_area(role, resume)
    theta = THETA[role]
    score = 0.0
    for a, w in weights.items():
        cov = min(1.0, S.get(a, 0.0) / max(1e-9, theta[a]))
        score += w * cov
    return round(100.0 * score, 1)

def fbeta(l2r: float, r2l: float, beta: float = 1.5) -> float:
    R = l2r / 100.0
    P = r2l / 100.0
    if (beta * beta * R + P) == 0:
        return 0.0
    f = (1 + beta**2) * (R * P) / (beta**2 * R + P)
    return f * 100.0

def hybrid(
    role: str,
    jd_text: str,
    resume: ResumeStruct,
    alpha: float = 0.4,
    beta: float = 1.5,
) -> Tuple[float, Dict[str, float], Dict[str, float], float, float, float]:
    l2r, coverages, norms = left_to_right(role, jd_text, resume)
    r2l = right_to_left(role, jd_text, resume)
    tech = technical(role, resume)
    f = fbeta(l2r, r2l, beta=beta)
    raw = (1 - alpha) * tech + alpha * f
    penalized = raw * negation_penalty(resume.raw_text)
    return round(penalized, 2), coverages, norms, round(tech, 1), l2r, r2l

def score_all(role: str, jd_text: str, resumes: List[Tuple[str, str]], alpha=0.4, beta=1.5, use_llm=True):
    canon = Canonicalizer(ALIASES)
    rows = []
    structs: Dict[str, ResumeStruct] = {}
    for name, txt in resumes:
        rs = extract_resume_struct(txt, role, canon, use_llm=use_llm)
        structs[name] = rs
        score, _, _, tech, l2r, r2l = hybrid(role, jd_text, rs, alpha=alpha, beta=beta)
        rows.append((name, score, tech, l2r, r2l, rs))
    rows.sort(key=lambda x: x[1], reverse=True)
    return rows, structs

# ===========================
# 6) LLM: JD SUGGESTIONS (4–5)
# ===========================
def llm_suggest_jds_from_resumes(resume_texts: List[str]) -> List[Dict[str, str]]:
    """
    Take combined resume text(s) and ask LLM to propose 4–5 roles + JDs.
    Returns list of {"role": ..., "jd": ...}.
    """
    if not LLM_ENABLED or not resume_texts:
        return []

    combined = "\n\n---\n\n".join(resume_texts)[:16000]
    system_prompt = """
You are a hiring assistant. You receive one or more resumes.
Propose 4–5 suitable software roles (e.g., Frontend Engineer, Backend Engineer, Data Scientist, Product Manager)
and short job descriptions for each role.

Return STRICT JSON like:
[
  {
    "role": "Frontend Engineer",
    "jd": "Job description text..."
  },
  {
    "role": "Backend Engineer",
    "jd": "Job description text..."
  }
]
Only JSON, no explanation.
""".strip()

    user_prompt = f"RESUMES:\n\"\"\"{combined}\"\"\""

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        raw_json = resp["choices"][0]["message"]["content"]
        data = json.loads(raw_json)
        out = []
        for item in data:
            r = item.get("role", "").strip()
            jd = item.get("jd", "").strip()
            if r and jd:
                out.append({"role": r, "jd": jd})
        return out
    except Exception as e:
        print(f"[warn] LLM JD suggestion failed: {e}")
        return []

# ===========================
# 7) STREAMLIT APP
# ===========================
def main():
    st.set_page_config(page_title="TalentIQ Hybrid Scorer", layout="wide")
    st.title("🧠 TalentIQ Hybrid Scorer")
    st.caption("Upload resumes → get JD suggestions → run hybrid scoring.")

    # Sidebar config
    st.sidebar.header("Configuration")
    role_choice = st.sidebar.selectbox(
        "Target role",
        options=["auto", "frontend", "backend", "data_science", "product"],
        index=0,
    )
    cutoff = st.sidebar.slider("Shortlist cutoff (Hybrid %)", 50.0, 95.0, 75.0, 1.0)
    topk = st.sidebar.slider("Max shortlist size", 1, 10, 5, 1)
    alpha = st.sidebar.slider("Alpha (blend Tech vs Fβ)", 0.0, 1.0, 0.4, 0.05)
    beta = st.sidebar.slider("Beta (Fβ weighting)", 0.5, 3.0, 1.5, 0.1)
    show_reasoning = st.sidebar.checkbox("Show weakest areas / why-cards", value=True)
    use_llm_parser = st.sidebar.checkbox("Use LLM to parse resumes", value=True)

    st.sidebar.markdown("---")
    st.sidebar.markdown(
        "LLM status: " +
        ("✅ enabled" if LLM_ENABLED else "⚠️ disabled (no OPENAI_API_KEY)")
    )

    # 1) Upload resumes
    st.subheader("1. Upload resumes (PDF or TXT)")
    uploaded_files = st.file_uploader(
        "Upload one or more resumes",
        type=["pdf", "txt"],
        accept_multiple_files=True,
    )

    resumes_in: List[Tuple[str, str]] = []

    if uploaded_files:
        # Use OS-safe temp directory (works on Windows, Mac, Linux)
        temp_dir = Path(tempfile.gettempdir())  # cross-platform temp dir

        for f in uploaded_files:
            if f.name.lower().endswith(".pdf"):
                # Save uploaded PDF to a temp file
                tmp_path = temp_dir / f.name
                tmp_path.write_bytes(f.read())
                # Extract text from that temp file
                text = load_pdf_text(str(tmp_path))
            else:
                # TXT file – read directly as text
                text = f.read().decode("utf-8", errors="ignore")

            resumes_in.append((f.name, text))



    if not resumes_in:
        st.info("Please upload at least one resume to continue.")
        return

    # 2) JD suggestions based on resumes
    st.subheader("2. Generate or edit Job Description")

    if "jd_suggestions" not in st.session_state:
        st.session_state.jd_suggestions = []
    if "selected_jd_index" not in st.session_state:
        st.session_state.selected_jd_index = 0

    col1, col2 = st.columns([1, 2])
    with col1:
        if st.button("✨ Suggest 4–5 JDs from resumes (LLM)"):
            with st.spinner("Asking LLM to propose roles and job descriptions..."):
                texts = [t for _, t in resumes_in]
                st.session_state.jd_suggestions = llm_suggest_jds_from_resumes(texts)
                st.session_state.selected_jd_index = 0

    suggestions = st.session_state.jd_suggestions

    if suggestions:
        roles_list = [s["role"] for s in suggestions]
        st.write("Suggested roles from LLM (editable JD below):")
        idx = st.selectbox(
            "Select a suggested role",
            options=list(range(len(roles_list))),
            format_func=lambda i: roles_list[i],
            index=st.session_state.selected_jd_index,
        )
        st.session_state.selected_jd_index = idx
        selected_suggestion = suggestions[idx]
        default_jd_text = selected_suggestion["jd"]
        default_role_label = selected_suggestion["role"]
    else:
        st.info("No LLM JD suggestions yet. You can still write your own JD manually.")
        default_jd_text = ""
        default_role_label = ""

    jd_role_label = st.text_input("Role label (for your reference)", default_role_label or "Frontend Engineer")
    jd_text = st.text_area(
        "Job Description (editable)",
        value=default_jd_text,
        height=220,
        placeholder="Paste or write the JD here, or click 'Suggest 4–5 JDs' above.",
    )

    if not jd_text.strip():
        st.warning("Please provide a Job Description to run scoring.")
        return

    # 3) Run scoring button
    st.subheader("3. Run hybrid scoring")
    if st.button("🚀 Score all candidates"):
        with st.spinner("Scoring candidates..."):
            global ROLE_WEIGHTS, TAXONOMY, ALIASES

            # Role & config
            if role_choice == "auto":
                inferred_role, ROLE_WEIGHTS_AUTO, TAXONOMY_AUTO, ALIASES_AUTO = config_from_jd(jd_text)
                role = inferred_role
                ROLE_WEIGHTS = ROLE_WEIGHTS_AUTO
                TAXONOMY = TAXONOMY_AUTO
                ALIASES = ALIASES_AUTO
                st.success(f"Inferred role from JD: **{role}** (label: {jd_role_label})")
            else:
                role = role_choice
                ROLE_WEIGHTS = {k: v.copy() for k, v in DEFAULT_ROLE_WEIGHTS.items()}
                TAXONOMY = {
                    k: {ka: list(vv) for ka, vv in va.items()}
                    for k, va in DEFAULT_TAXONOMY.items()
                }
                ALIASES = {k: list(v) for k, v in DEFAULT_ALIASES.items()}
                st.info(f"Using fixed role: **{role}** (label: {jd_role_label})")

            # Score all resumes
            scored, structs = score_all(
                role, jd_text, resumes_in, alpha=alpha, beta=beta, use_llm=use_llm_parser
            )

            # Overview table
            st.subheader("4. Ranked candidates")
            table_rows = []
            for i, (name, score, tech, l2r, r2l, _) in enumerate(scored, 1):
                table_rows.append(
                    {
                        "Rank": i,
                        "Candidate": name,
                        "Hybrid%": score,
                        "Tech": tech,
                        "L→R": l2r,
                        "R→L": r2l,
                    }
                )
            st.dataframe(table_rows, use_container_width=True)

            # Shortlist vs rejected
            shortlist = [(n, s, t, r1, r2) for (n, s, t, r1, r2, _) in scored if s >= cutoff][:topk]
            shortlisted_names = {n for (n, *_rest) in shortlist}
            rejected = [(n, s, t, r1, r2) for (n, s, t, r1, r2, _) in scored if n not in shortlisted_names]

            st.markdown(f"### ✅ Interview shortlist (Hybrid ≥ {cutoff:.0f}%, top {topk})")
            if not shortlist:
                st.write("_No candidates reached the threshold._")
            else:
                for i, (name, score, tech, l2r, r2l) in enumerate(shortlist, 1):
                    st.write(
                        f"{i}. **{name}** — Hybrid: {score:.2f}% | "
                        f"Tech: {tech:.1f} | L→R: {l2r:.1f} | R→L: {r2l:.1f}"
                    )

            st.markdown("### ❌ Rejected")
            if not rejected:
                st.write("_None_")
            else:
                for name, score, tech, l2r, r2l in rejected:
                    weakest = "L→R" if l2r < r2l else "R→L"
                    st.write(
                        f"- **{name}** — Hybrid: {score:.2f}% "
                        f"(Tech: {tech:.1f}, L→R: {l2r:.1f}, R→L: {r2l:.1f}; weakest={weakest})"
                    )

            # Candidate details
            st.subheader("5. Candidate details & why-cards")
            for (name, score, tech, l2r, r2l, rs) in scored:
                with st.expander(f"{name} — Hybrid {score:.2f}%"):
                    score2, covers, norms, tech2, l2r2, r2l2 = hybrid(
                        role, jd_text, rs, alpha=alpha, beta=beta
                    )
                    st.markdown(
                        f"**Tech**: {tech2:.1f} &nbsp;&nbsp; "
                        f"**L→R**: {l2r2:.1f} &nbsp;&nbsp; "
                        f"**R→L**: {r2l2:.1f} &nbsp;&nbsp; "
                        f"**Hybrid**: {score2:.2f}%"
                    )

                    st.markdown("**Area coverage (weight, supply/θ → coverage)**")
                    weights = ROLE_WEIGHTS[role]
                    for a, w in weights.items():
                        cov = covers.get(a, 0.0)
                        norm = norms.get(a, 0.0)
                        st.write(
                            f"- `{a}` — weight={w:.2f}, supply/θ={norm:.2f}, covered={cov:.2f}"
                        )

                    if show_reasoning:
                        st.markdown("**Why-cards (evidence snippets)**")
                        area_skills: Dict[str, List[SkillItem]] = defaultdict(list)
                        area_map = TAXONOMY[role]
                        rev = defaultdict(list)
                        for area, skills in area_map.items():
                            for s in skills:
                                rev[s.lower()].append(area)
                        for sk in rs.skills:
                            if sk.name.lower() in rev:
                                for a in rev[sk.name.lower()]:
                                    area_skills[a].append(sk)

                        for a in ROLE_WEIGHTS[role].keys():
                            st.write(f"- **{a}**")
                            if not area_skills[a]:
                                st.write("  - (no evidence)")
                                continue
                            shown = 0
                            for sk in area_skills[a]:
                                st.write(f"  - `{sk.name}` (depth={depth(sk):.2f})")
                                for s_snip in sk.evidence_snippets[:2]:
                                    st.code(s_snip)
                                shown += 1
                                if shown >= 3:
                                    break

if __name__ == "__main__":
    main()

import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import feather from "feather-icons";
import "./candidateCompare.css";

function CandidateCard({ c }) {
    return (
        <div className="cc-card">
            <h2 className="cc-name">{c.name}</h2>

            <div className="cc-chips-row">
                <span className={`cc-chip ${c.matchChip}`}>{c.matchText}</span>
                <span className={`cc-chip ${c.statusChip}`}>{c.status}</span>
            </div>

            {/* radar */}
            <div className="cc-radar-wrap">
                <div className="cc-radar">
                    {c.dots.map((d, i) => (
                        <span key={i} className="cc-dot" style={{ top: d.top, left: d.left }} />
                    ))}
                </div>
            </div>

            {/* skills list */}
            <div className="cc-section">
                <h3 className="cc-h3">Skills vs Required</h3>
                <ul className="cc-skill-list">
                    {c.skills.map(([name, score, color], i) => (
                        <li key={i} className="cc-skill-row">
                            <span className="cc-skill">{name}</span>
                            <span className={`cc-score ${color}`}>{score}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* analysis chips */}
            <div className="cc-section">
                <h3 className="cc-h3">Analysis</h3>
                <div className="cc-chip-row">
                    {c.gaps.map((g, i) => (
                        <span key={i} className="cc-chip cc-chip-red">{g}</span>
                    ))}
                </div>
                <div className="cc-chip-row">
                    {c.adjacent.map((a, i) => (
                        <span key={i} className="cc-chip cc-chip-blue">{a}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CandidateCompare() {
    const [searchParams] = useSearchParams();

    // Run feather after each render that changes the DOM (picked affects it)
    useEffect(() => {
        feather.replace();
    });

    // master data (NO JSX inside this!)
    const all = useMemo(
        () => ({
            sarah: {
                id: "sarah",
                initials: "SC",
                name: "Sarah Chen",
                matchText: "83% Match",
                status: "Shortlisted",
                matchChip: "cc-chip-amber",
                statusChip: "cc-chip-blue",
                skills: [
                    ["Python", "4.5/5", "cc-score-green"],
                    ["SQL", "4/5", "cc-score-green"],
                    ["Pandas", "4.5/5", "cc-score-green"],
                    ["AWS", "3/5", "cc-score-amber"],
                ],
                gaps: ["AWS Experience Gap"],
                adjacent: ["GCP → AWS (0.7)", "Excel → Pandas (0.8)"],
                dots: [
                    { top: "28%", left: "50%" },
                    { top: "50%", left: "74%" },
                    { top: "70%", left: "50%" },
                    { top: "50%", left: "26%" },
                ],
            },
            marcus: {
                id: "marcus",
                initials: "MJ",
                name: "Marcus Johnson",
                matchText: "76% Match",
                status: "Screening",
                matchChip: "cc-chip-amber",
                statusChip: "cc-chip-blue",
                skills: [
                    ["Python", "4/5", "cc-score-green"],
                    ["SQL", "3/5", "cc-score-amber"],
                    ["Pandas", "4/5", "cc-score-green"],
                    ["AWS", "4.5/5", "cc-score-green"],
                ],
                gaps: ["SQL Experience Gap"],
                adjacent: ["Azure → AWS (0.8)"],
                dots: [
                    { top: "30%", left: "50%" },
                    { top: "50%", left: "70%" },
                    { top: "70%", left: "50%" },
                    { top: "50%", left: "30%" },
                ],
            },
            alex: {
                id: "alex",
                initials: "AR",
                name: "Alex Rodriguez",
                matchText: "71% Match",
                status: "Screening",
                matchChip: "cc-chip-amber",
                statusChip: "cc-chip-blue",
                skills: [
                    ["Python", "3.5/5", "cc-score-amber"],
                    ["SQL", "4/5", "cc-score-green"],
                    ["Pandas", "3/5", "cc-score-amber"],
                    ["AWS", "4/5", "cc-score-green"],
                ],
                gaps: ["Python Experience Gap", "Pandas Experience Gap"],
                adjacent: ["R → Python (0.6)"],
                dots: [
                    { top: "32%", left: "50%" },
                    { top: "50%", left: "66%" },
                    { top: "72%", left: "50%" },
                    { top: "50%", left: "34%" },
                ],
            },
        }),
        []
    );

    // ids from URL: /compare?ids=alex,sarah (defaults to first 2; max 3)
    const order = ["sarah", "marcus", "alex"];
    let ids = (searchParams.get("ids") || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .filter((id) => all[id]);

    if (ids.length === 0) ids = order.slice(0, 2);
    if (ids.length > 3) ids = ids.slice(0, 3);

    const picked = ids.map((id) => all[id]);

    return (
        <div className="cc-page">
            {/* top nav (minimal) */}
            <div className="cc-topbar">
                <Link to="/job-overview" className="cc-back">
                    <i data-feather="arrow-left" className="cc-i" />
                    Back to Job
                </Link>
                <div className="cc-title">Candidate Comparison</div>
                <div />
            </div>

            {/* grid of cards */}
            <div className="cc-grid">
                {picked.map((c) => (
                    <CandidateCard key={c.id} c={c} />
                ))}
            </div>

            {/* AI Comparison Summary */}
            <div className="cc-summary">
                <div className="cc-summary-head">
                    <i data-feather="message-square" className="cc-i cc-i-fuchsia" />
                    <h3 className="cc-summary-title">AI Comparison Summary</h3>
                </div>
                <p className="cc-summary-text">
                    Sarah Chen demonstrates the strongest overall match with exceptional Python and Pandas skills, though she has a
                    minor gap in AWS experience. Marcus Johnson shows excellent AWS expertise but needs development in SQL. Alex
                    Rodriguez has balanced skills but lower proficiency in core Python and Pandas requirements. Sarah is recommended
                    for immediate progression to technical interview, while Marcus could be considered with additional SQL assessment.
                </p>
            </div>
        </div>
    );
}

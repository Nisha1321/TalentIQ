

// jobOverview.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ NEW
import feather from "feather-icons";
import "./jobOverview.css";
import Navbar from "./navbar";

export default function JobOverview() {
    const navigate = useNavigate(); // ⬅️ NEW

    const [selectedId, setSelectedId] = useState("sarah");
    const [selectedIds, setSelectedIds] = useState([]); // ⬅️ NEW (for compare)
    const [uploads, setUploads] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        feather.replace();
    }, []);

    const candidates = useMemo(
        () => ({
            sarah: {
                id: "sarah",
                initials: "SC",
                name: "Sarah Chen",
                match: "83%",
                matchChip: "bg-green-100 text-green-800",
                stageChip: "bg-green-100 text-green-800",
                stage: "Shortlisted",
                breakdown: { rubric: 85, semantic: 78, exp: 92, gap: 12 },
                skills: [
                    { name: "Python", level: "Excellent (4.5/5)" },
                    { name: "SQL", level: "Strong (4/5)" },
                    { name: "Pandas", level: "Excellent (4.5/5)" },
                    { name: "AWS", level: "Moderate (3/5)" },
                ],
                years: 4,
                badgeBg: "bg-fuchsia-100",
                badgeText: "text-fuchsia-600",
                rowChip: "bg-green-100 text-green-800",
            },
            marcus: {
                id: "marcus",
                initials: "MJ",
                name: "Marcus Johnson",
                match: "76%",
                matchChip: "bg-blue-100 text-blue-800",
                stageChip: "bg-blue-100 text-blue-800",
                stage: "Screening",
                breakdown: { rubric: 78, semantic: 72, exp: 88, gap: 18 },
                skills: [
                    { name: "Python", level: "Strong (4/5)" },
                    { name: "SQL", level: "Moderate (3/5)" },
                    { name: "Pandas", level: "Strong (4/5)" },
                    { name: "AWS", level: "Excellent (4.5/5)" },
                ],
                years: 3,
                badgeBg: "bg-blue-100",
                badgeText: "text-blue-600",
                rowChip: "bg-blue-100 text-blue-800",
            },
        }),
        []
    );

    const sel = candidates[selectedId];

    // Resume upload handlers
    const onFiles = (files) => {
        const accepted = Array.from(files).filter((f) =>
            /\.(pdf|doc|docx)$/i.test(f.name)
        );
        setUploads((prev) => [...prev, ...accepted]);
    };
    const onInputChange = (e) => onFiles(e.target.files);
    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        onFiles(e.dataTransfer.files);
    };
    const onRemove = (idx) =>
        setUploads((prev) => prev.filter((_, i) => i !== idx));

    // ⬅️ NEW: checkbox handlers for compare
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    const allIds = ["sarah", "marcus"];
    const allChecked = selectedIds.length === allIds.length;
    const toggleAll = () => {
        setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));
    };
    const goCompare = () => {
        if (selectedIds.length >= 2) {
            navigate(`/compare?ids=${selectedIds.join(",")}`);
        }
    };

    return (
        <div className="bg-gray-50 font-inter min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900">Data Analyst</h1>
                            <p className="text-gray-600">
                                Analytics Department • Remote • Posted 2 weeks ago
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                                <i data-feather="share-2" className="mr-2 h-4 w-4" />
                                Share
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                                <i data-feather="edit" className="mr-2 h-4 w-4" />
                                Edit Job
                            </button>
                        </div>
                    </div>

                    {/* Pipeline */}
                    <div className="mt-6 grid grid-cols-6 gap-4">
                        {[
                            ["Applied", "24", "text-fuchsia-600"],
                            ["Screen", "8", "text-blue-600"],
                            ["Interview", "3", "text-yellow-600"],
                            ["Offer", "1", "text-purple-600"],
                            ["Hired", "0", "text-green-600"],
                            ["Rejected", "12", "text-red-600"],
                        ].map(([label, val, color]) => (
                            <div className="text-center" key={label}>
                                <div className={`text-2xl font-bold ${color}`}>{val}</div>
                                <div className="text-sm text-gray-600">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Always horizontal: 3 columns */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Job brief */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Job Description
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We're looking for a Data Analyst to join our analytics team.
                                You'll work with cross-functional teams to derive insights from
                                data and drive business decisions.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Required Skills
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            ["Python", "Weight: 30% • Req: 3/5", 90, "bg-fuchsia-500"],
                                            ["SQL", "Weight: 25% • Req: 2/5", 80, "bg-blue-500"],
                                            ["Pandas", "Weight: 25% • Req: 2/5", 85, "bg-green-500"],
                                            ["AWS", "Weight: 20% • Req: 2/5", 70, "bg-yellow-500"],
                                        ].map(([skill, meta, pct, color]) => (
                                            <div key={skill}>
                                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                    <span>{skill}</span>
                                                    <span>{meta}</span>
                                                </div>
                                                <div className="score-bar">
                                                    <div
                                                        className={`score-fill ${color}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-fuchsia-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <i
                                            data-feather="info"
                                            className="h-4 w-4 text-fuchsia-600 mr-2"
                                        />
                                        <span className="text-sm font-medium text-fuchsia-800">
                                            Scoring Recipe
                                        </span>
                                    </div>
                                    <p className="text-xs text-fuchsia-700">
                                        α=0.55 (Rubric) • β=0.25 (Semantic) • γ=0.10 (Experience) •
                                        δ=0.10 (Gap)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: Candidates table */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Candidates
                                </h3>
                                <div className="flex space-x-2">
                                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <i data-feather="filter" className="mr-1 h-4 w-4" />
                                        Filter
                                    </button>
                                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <i data-feather="download" className="mr-1 h-4 w-4" />
                                        Export
                                    </button>
                                    {/* ⬇️ NEW: Compare button */}
                                    <button
                                        onClick={goCompare}

                                        className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${selectedIds.length < 2
                                            ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                            }`}
                                        title={

                                            "Compare selected candidates"
                                        }
                                    >
                                        <i data-feather="users" className="mr-1 h-4 w-4" />
                                        Compare
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    checked={allChecked}
                                                    onChange={toggleAll}
                                                    className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                                                    aria-label="Select all candidates"
                                                />
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Match
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stage
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Years
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {allIds.map((id, idx) => {
                                            const c = candidates[id];
                                            const checked = selectedIds.includes(id);
                                            return (
                                                <tr
                                                    key={id}
                                                    className={`cursor-pointer hover:bg-gray-50 ${selectedId === id ? "ring-1 ring-fuchsia-200" : ""
                                                        }`}
                                                    onClick={() => setSelectedId(id)}
                                                >
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                toggleSelect(id);
                                                            }}
                                                            className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                                                            aria-label={`Select ${c.name}`}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div
                                                                className={`w-8 h-8 ${c.badgeBg} rounded-full flex items-center justify-center ${c.badgeText} font-bold text-sm`}
                                                            >
                                                                {c.initials}
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {c.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.rowChip}`}
                                                        >
                                                            {c.match}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.stageChip}`}
                                                        >
                                                            {c.stage}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {c.years}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* helper text */}
                            <p className="text-xs text-gray-500 mt-3">
                                Tip: check at least two candidates then click <strong>Compare</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right: Why card + Resume Upload */}
                    <div className="col-span-1">
                        <div id="why-card" className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <div className="text-center mb-6">
                                <div
                                    className={`w-16 h-16 ${sel.badgeBg} rounded-full flex items-center justify-center ${sel.badgeText} font-bold text-xl mx-auto mb-3`}
                                >
                                    {sel.initials}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {sel.name}
                                </h3>
                                <div className="flex items-center justify-center mt-2">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${sel.matchChip}`}>
                                        {sel.match} Match
                                    </span>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${sel.stageChip}`}>
                                        {sel.stage}
                                    </span>
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="space-y-4 mb-6">
                                <h4 className="font-medium text-gray-900">Score Breakdown</h4>
                                <div className="space-y-3">
                                    {[
                                        ["Rubric Score", sel.breakdown.rubric, "bg-fuchsia-500"],
                                        ["Semantic Match", sel.breakdown.semantic, "bg-blue-500"],
                                        ["Experience", sel.breakdown.exp, "bg-green-500"],
                                        ["Gap Penalty", sel.breakdown.gap, "bg-red-500"],
                                    ].map(([label, pct, color]) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>{label}</span>
                                                <span>{label === "Gap Penalty" ? `-${pct}%` : `${pct}%`}</span>
                                            </div>
                                            <div className="score-bar">
                                                <div className={`score-fill ${color}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Skill Analysis</h4>
                                <div className="space-y-2">
                                    {sel.skills.map((s) => (
                                        <div key={s.name} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{s.name}</span>
                                            <span className="font-medium">{s.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center mb-2">
                                    <i data-feather="lightbulb" className="h-4 w-4 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-blue-800">AI Suggestions</span>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Strong fit on core analytics stack. Consider moving to technical interview; minor AWS gaps can be trained.
                                </p>
                            </div>

                            {/* Resume Upload */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Upload Resume</h4>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOver(true);
                                    }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={onDrop}
                                    className={`border-2 border-dashed rounded-lg p-4 text-center ${dragOver ? "border-fuchsia-400 bg-fuchsia-50" : "border-gray-300"
                                        }`}
                                >
                                    <i data-feather="upload" className="h-5 w-5 inline-block mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        Drag & drop PDF/DOC/DOCX here, or
                                    </span>
                                    <label className="ml-1 text-sm font-medium text-fuchsia-700 cursor-pointer hover:underline">
                                        browse
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={onInputChange}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">Max 5 files, up to 10MB each</p>
                                </div>

                                {uploads.length > 0 && (
                                    <ul className="mt-3 space-y-2">
                                        {uploads.map((f, i) => (
                                            <li
                                                key={`${f.name}-${i}`}
                                                className="flex items-center justify-between text-sm bg-gray-50 rounded-md px-3 py-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <i data-feather="file-text" className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-900">{f.name}</span>
                                                    <span className="text-gray-500">
                                                        {(f.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => onRemove(i)}
                                                    className="text-gray-500 hover:text-red-600"
                                                    aria-label={`Remove ${f.name}`}
                                                >
                                                    <i data-feather="x" className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                                    <i data-feather="user-check" className="mr-2 h-4 w-4" />
                                    Move to Interview
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                                        <i data-feather="file-text" className="mr-2 h-4 w-4" />
                                        Add Note
                                    </button>
                                    <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                                        <i data-feather="download" className="mr-2 h-4 w-4" />
                                        Export PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end right */}
                </div>
            </div>
        </div>
    );
}

import { useEffect } from "react";
import feather from "feather-icons";
import "./analytics.css";
import Navbar from "./navbar";

export default function Analytics() {
    useEffect(() => {
        feather.replace();
    }, []);

    return (
        <div className="bg-gray-50 font-inter min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
                    <p className="text-gray-600">Track and optimize your hiring pipeline performance</p>
                </div>

                {/* Filters – single row, large Apply button */}
                <div className="card mb-6">
                    <div className="filters-row">
                        <div className="field">
                            <label className="label">Job Position</label>
                            <select className="select">
                                <option>Data Analyst</option>
                                <option>Backend Engineer</option>
                                <option>Product Designer</option>
                            </select>
                        </div>
                        <div className="field">
                            <label className="label">Date Range</label>
                            <select className="select">
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                                <option>Last 6 months</option>
                                <option>Custom range</option>
                            </select>
                        </div>
                        <div className="field">
                            <label className="label">Stage Filter</label>
                            <select className="select">
                                <option>All Stages</option>
                                <option>Applied</option>
                                <option>Screening</option>
                                <option>Interview</option>
                                <option>Offer</option>
                            </select>
                        </div>
                        <div className="field btn-cell">
                            <button className="btn-primary w-full">
                                <i data-feather="sliders" className="mr-2 h-4 w-4"></i>
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI cards – 4 across */}
                <div className="kpi-row mb-6">
                    {[
                        { icon: "clock", label: "Time-to-Screen", value: "3.2 days", icBg: "bg-blue-100", ic: "text-blue-600" },
                        { icon: "users", label: "Interview Rate", value: "42%", icBg: "bg-green-100", ic: "text-green-600" },
                        { icon: "award", label: "Offer Rate", value: "18%", icBg: "bg-purple-100", ic: "text-purple-600" },
                        { icon: "star", label: "Candidate NPS", value: "+32", icBg: "bg-fuchsia-100", ic: "text-fuchsia-600" },
                    ].map((k, i) => (
                        <div className="kpi-card" key={i}>
                            <div className={`kpi-icon ${k.icBg}`}>
                                <i data-feather={k.icon} className={k.ic}></i>
                            </div>
                            <div className="kpi-meta">
                                <div className="kpi-label">{k.label}</div>
                                <div className="kpi-value">{k.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts – 2 columns like the screenshot */}
                <div className="grid-2 mb-6">
                    <div className="panel">
                        <h3 className="panel-title">Application Funnel</h3>
                        <div className="viz">
                            <div className="viz-inner">
                                <i data-feather="bar-chart-2" className="h-12 w-12 mx-auto mb-2 text-gray-400"></i>
                                <p className="viz-caption">Funnel visualization would appear here</p>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 className="panel-title">Match Score Distribution</h3>
                        <div className="viz">
                            <div className="viz-inner">
                                <i data-feather="bar-chart" className="h-12 w-12 mx-auto mb-2 text-gray-400"></i>
                                <p className="viz-caption">Histogram visualization would appear here</p>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 className="panel-title">Average Score Over Time</h3>
                        <div className="viz">
                            <div className="viz-inner">
                                <i data-feather="trending-up" className="h-12 w-12 mx-auto mb-2 text-gray-400"></i>
                                <p className="viz-caption">Line chart visualization would appear here</p>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 className="panel-title">Skills vs Candidates</h3>
                        <div className="viz">
                            <div className="viz-inner">
                                <i data-feather="grid" className="h-12 w-12 mx-auto mb-2 text-gray-400"></i>
                                <p className="viz-caption">Heatmap visualization would appear here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables – 2 across */}
                <div className="grid-2">
                    <div className="table-card">
                        <div className="table-head">
                            <h3>Shortlist Quality</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="th">Candidate</th>
                                        <th className="th">Score</th>
                                        <th className="th">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[
                                        ["Sarah Chen", "83%", "Hired", "bg-green-100 text-green-800"],
                                        ["Marcus Johnson", "76%", "Interview", "bg-blue-100 text-blue-800"],
                                        ["Alex Rodriguez", "71%", "Screening", "bg-yellow-100 text-yellow-800"],
                                    ].map(([name, score, out, chip], i) => (
                                        <tr key={i}>
                                            <td className="td name">{name}</td>
                                            <td className="td">{score}</td>
                                            <td className="td">
                                                <span className={`chip ${chip}`}>{out}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-head">
                            <h3>Skill Impact Analysis</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="th">Skill</th>
                                        <th className="th">Weight</th>
                                        <th className="th">Success Lift</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[
                                        ["Python", "30%", "+42%"],
                                        ["SQL", "25%", "+35%"],
                                        ["Pandas", "25%", "+38%"],
                                        ["AWS", "20%", "+28%"],
                                    ].map(([skill, weight, lift], i) => (
                                        <tr key={i}>
                                            <td className="td name">{skill}</td>
                                            <td className="td">{weight}</td>
                                            <td className="td">{lift}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button className="btn-secondary">
                        <i data-feather="download" className="mr-2 h-4 w-4"></i>
                        Export CSV
                    </button>
                    <button className="btn-primary">
                        <i data-feather="file-text" className="mr-2 h-4 w-4"></i>
                        Export PDF Report
                    </button>
                </div>
            </div>
        </div>
    );
}

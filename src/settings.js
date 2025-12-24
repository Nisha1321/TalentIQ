// settings.js
import { useEffect, useMemo, useState } from "react";
import feather from "feather-icons";
import "./settings.css";
import Navbar from "./navbar";
export default function Settings() {
    useEffect(() => {
        feather.replace();
    });

    const [alpha, setAlpha] = useState(55);
    const [beta, setBeta] = useState(25);
    const [gamma, setGamma] = useState(10);
    const [delta, setDelta] = useState(10);

    const total = alpha + beta + gamma + delta;
    const totalClass = total === 100 ? "text-fuchsia-600" : "text-red-600";

    const preview = useMemo(
        () => ({
            a: (alpha / 100).toFixed(2),
            b: (beta / 100).toFixed(2),
            g: (gamma / 100).toFixed(2),
            d: (delta / 100).toFixed(2),
        }),
        [alpha, beta, gamma, delta]
    );

    return (
        <div className="bg-gray-50 font-inter min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Configure your scoring algorithm and export preferences</p>
                </div>

                {/* Tabs (static) */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <a href="#" className="border-fuchsia-500 text-fuchsia-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Scoring
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Critical Skills
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Adjacency
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Exports
                        </a>
                    </nav>
                </div>

                {/* Scoring */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Scoring Algorithm Weights</h2>
                    <p className="text-gray-600 mb-6">Adjust the weighting factors for the hybrid scoring algorithm. Total must equal 100%.</p>

                    <div className="space-y-6">
                        {/* Alpha */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Rubric Score (α)</label>
                                <span className="text-sm text-gray-500">{alpha}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={alpha} onChange={(e) => setAlpha(+e.target.value)} className="slider" />
                            <p className="text-xs text-gray-500 mt-1">Weight for structured skill assessment and requirements matching</p>
                        </div>

                        {/* Beta */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Semantic Match (β)</label>
                                <span className="text-sm text-gray-500">{beta}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={beta} onChange={(e) => setBeta(+e.target.value)} className="slider" />
                            <p className="text-xs text-gray-500 mt-1">Weight for contextual understanding and experience relevance</p>
                        </div>

                        {/* Gamma */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Experience (γ)</label>
                                <span className="text-sm text-gray-500">{gamma}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={gamma} onChange={(e) => setGamma(+e.target.value)} className="slider" />
                            <p className="text-xs text-gray-500 mt-1">Weight for years of relevant experience</p>
                        </div>

                        {/* Delta */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Gap Penalty (δ)</label>
                                <span className="text-sm text-gray-500">{delta}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={delta} onChange={(e) => setDelta(+e.target.value)} className="slider" />
                            <p className="text-xs text-gray-500 mt-1">Penalty for missing critical skills or significant experience gaps</p>
                        </div>

                        {/* Total */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total Weight</span>
                                <span className={`text-lg font-bold ${totalClass}`}>{total}%</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-fuchsia-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-fuchsia-800 mb-2">Preview Formula</h4>
                            <p className="text-sm text-fuchsia-700">
                                final_score = <span>{preview.a}</span>·Rubric + <span>{preview.b}</span>·Semantic + <span>{preview.g}</span>·Experience − <span>{preview.d}</span>·Gap
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Critical Skills */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Critical Skills</h2>
                    <p className="text-gray-600 mb-6">Mark skills as "must-have" to enforce stricter requirements</p>

                    {[
                        { name: "Python", meta: "Required level: 3/5 • Current weight: 30%", checked: false },
                        { name: "AWS", meta: "Required level: 2/5 • Current weight: 20%", checked: true },
                        { name: "SQL", meta: "Required level: 2/5 • Current weight: 25%", checked: false },
                    ].map((s) => (
                        <div key={s.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                            <div>
                                <span className="text-sm font-medium text-gray-900">{s.name}</span>
                                <p className="text-xs text-gray-500">{s.meta}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked={s.checked} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                            </label>
                        </div>
                    ))}

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Critical Skill Penalty</label>
                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md">
                            <option>Cap score at 55% if missing</option>
                            <option>Apply 10% gap penalty</option>
                            <option>Apply 20% gap penalty</option>
                            <option>Auto-reject if missing</option>
                        </select>
                    </div>
                </div>

                {/* Adjacency */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Adjacency Mapping</h2>
                    <p className="text-gray-600 mb-6">Define skill equivalencies and transfer values</p>

                    {[
                        { from: "GCP", to: "AWS", decay: 0.7, note: "Google Cloud Platform experience counts toward AWS requirement" },
                        { from: "Excel", to: "Pandas", decay: 0.8, note: "Advanced Excel experience counts toward Pandas requirement" },
                        { from: "R", to: "Python", decay: 0.6, note: "R programming experience counts toward Python requirement" },
                    ].map((r) => (
                        <div key={`${r.from}-${r.to}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-900">{r.from}</span>
                                    <i data-feather="arrow-right" className="h-4 w-4 text-gray-400"></i>
                                    <span className="text-sm font-medium text-gray-900">{r.to}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{r.note}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Decay:</span>
                                <input type="number" min="0" max="1" step="0.1" defaultValue={r.decay} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" />
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 flex justify-between items-center">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                            <i data-feather="plus" className="mr-2 h-4 w-4"></i>
                            Add New Rule
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Export preferences */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Preferences</h2>
                    <p className="text-gray-600 mb-6">Configure data export settings and privacy options</p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">CSV Export Columns</h3>
                            {[
                                ["Candidate Name", true],
                                ["Email", true],
                                ["Match Score", true],
                                ["Stage", true],
                                ["Phone Number", false],
                                ["Address", false],
                            ].map(([label, def]) => (
                                <label key={label} className="inline-flex items-center block mb-2">
                                    <input type="checkbox" defaultChecked={def} className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>

                        <div>
                            <label className="inline-flex items-center">
                                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                                <span className="ml-2 text-sm text-gray-700">Redact PII in exports</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Automatically remove personally identifiable information from exported files</p>
                        </div>

                        <div>
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                                <span className="ml-2 text-sm text-gray-700">Include scoring breakdown</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Add detailed scoring components to export files</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

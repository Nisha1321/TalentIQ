// jobs.js
import { useEffect, useMemo, useState } from "react";
import feather from "feather-icons";
import "./jobs.css";
import Navbar from "./navbar";

export default function Jobs() {
    const [query, setQuery] = useState("");
    const [department, setDepartment] = useState("All Departments");
    const [location, setLocation] = useState("All Locations");
    const [status, setStatus] = useState("All Status");

    useEffect(() => {
        feather.replace();
    });

    const rows = useMemo(
        () => [
            {
                title: "Data Analyst",
                department: "Analytics",
                location: "Remote",
                status: "Active",
                statusChip: "bg-green-100 text-green-800",
                applicants: 24,
                shortlisted: 8,
                updated: "2 hours ago",
                href: "/job-overview", // wire to your router
            },
            {
                title: "Backend Engineer",
                department: "Engineering",
                location: "San Francisco",
                status: "Active",
                statusChip: "bg-green-100 text-green-800",
                applicants: 42,
                shortlisted: 12,
                updated: "1 day ago",
                href: "/job-overview",
            },
            {
                title: "Product Designer",
                department: "Design",
                location: "New York",
                status: "Draft",
                statusChip: "bg-yellow-100 text-yellow-800",
                applicants: 0,
                shortlisted: 0,
                updated: "3 days ago",
                href: "/job-overview",
            },
            {
                title: "Senior Frontend Developer",
                department: "Engineering",
                location: "Remote",
                status: "Closed",
                statusChip: "bg-red-100 text-red-800",
                applicants: 67,
                shortlisted: 15,
                updated: "1 week ago",
                href: "/job-overview",
            },
        ],
        []
    );

    const filtered = rows.filter((r) => {
        const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
        const matchesDept = department === "All Departments" || r.department === department;
        const matchesLoc = location === "All Locations" || r.location === location;
        const matchesStatus = status === "All Status" || r.status === status;
        return matchesQuery && matchesDept && matchesLoc && matchesStatus;
    });

    return (
        <div className="bg-gray-50 font-inter min-h-screen">
            <Navbar />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Open Positions</h1>
                        <p className="mt-2 text-sm text-gray-600">Manage and track all your open job positions</p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
                            <i data-feather="plus" className="mr-2 h-4 w-4"></i>
                            New Job
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    className="focus:ring-fuchsia-500 focus:border-fuchsia-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Search jobs..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <i data-feather="search" className="h-4 w-4 text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                {["All Departments", "Engineering", "Product", "Design", "Marketing", "Analytics"].map((d) => (
                                    <option key={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                {["All Locations", "Remote", "New York", "San Francisco", "London"].map((d) => (
                                    <option key={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {["All Status", "Active", "Draft", "Closed"].map((d) => (
                                    <option key={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Title", "Department", "Location", "Status", "Applicants", "Shortlisted", "Last Updated", ""].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {h || <span className="sr-only">Actions</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.map((r) => (
                                <tr
                                    key={r.title}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => (window.location.href = r.href)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{r.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.statusChip}`}>{r.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.applicants}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.shortlisted}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.updated}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href={r.href} className="text-fuchsia-600 hover:text-fuchsia-900">Open</a>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No jobs match your current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

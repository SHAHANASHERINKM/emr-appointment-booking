import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import logApi from "../../api/logApi";
import Pagination from "../../components/common/Pagination";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const actionColors = {
    LOGIN: "bg-emerald-100 text-emerald-700",
    LOGOUT: "bg-gray-100 text-gray-600",
    LOGIN_FAILED: "bg-red-100 text-red-700",
    CREATE: "bg-blue-100 text-blue-700",
    UPDATE: "bg-orange-100 text-orange-700",
    DELETE: "bg-rose-100 text-rose-700",
    VIEW: "bg-purple-100 text-purple-700",
};

const entityColors = {
    auth: "bg-slate-100 text-slate-600",
    appointment: "bg-blue-50 text-blue-600",
    patient: "bg-emerald-50 text-emerald-600",
    user: "bg-purple-50 text-purple-600",
    slot: "bg-orange-50 text-orange-600",
};

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ action: "", entity: "" });

    useEffect(() => { fetchLogs(); }, [page, filters]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (filters.action) params.action = filters.action;
            if (filters.entity) params.entity = filters.entity;
            const res = await logApi.getLogs(params);
            setLogs(res.data.data);
            setTotal(res.data.pagination?.total || 0);
            setTotalPages(res.data.pagination?.pages || 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    };

    return (
        <Layout pageTitle="Audit Logs">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
                <p className="text-gray-500 mt-1">Track all system actions and events</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3">
                    <select
                        name="action"
                        value={filters.action}
                        onChange={handleFilterChange}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Actions</option>
                        <option value="LOGIN">Login</option>
                        <option value="LOGOUT">Logout</option>
                        <option value="LOGIN_FAILED">Login Failed</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>
                    <select
                        name="entity"
                        value={filters.entity}
                        onChange={handleFilterChange}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Entities</option>
                        <option value="auth">Auth</option>
                        <option value="appointment">Appointment</option>
                        <option value="patient">Patient</option>
                        <option value="user">User</option>
                    </select>
                    <button
                        onClick={() => { setFilters({ action: "", entity: "" }); setPage(1); }}
                        className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                    <span className="ml-auto text-sm text-gray-500 self-center">
                        {total} total logs
                    </span>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50">
                                {["User", "Role", "Action", "Entity", "Description", "IP Address", "Timestamp"].map((h) => (
                                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableLoader colSpan={7} />
                            ) : logs.length === 0 ? (
                                <EmptyState colSpan={7} message="No logs found" />
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log._id} className={`transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            {log.userId ? (
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{log.userId.name}</p>
                                                    <p className="text-xs text-gray-400">{log.userId.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Unknown</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            {log.role ? (
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium capitalize">
                                                    {log.role.replace("_", " ")}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${actionColors[log.action] || "bg-gray-100 text-gray-600"}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${entityColors[log.entity] || "bg-gray-100 text-gray-600"}`}>
                                                {log.entity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            <p className="text-sm text-gray-600 max-w-xs truncate">{log.description}</p>
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            <span className="text-xs text-gray-500 font-mono">{log.ipAddress || "-"}</span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-100">
                                            <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden divide-y divide-gray-100">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-10 text-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl block mb-2">history</span>
                            No logs found
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log._id} className="p-4 hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{log.userId?.name || "Unknown"}</p>
                                        <p className="text-xs text-gray-400">{log.userId?.email || "-"}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${actionColors[log.action] || "bg-gray-100 text-gray-600"}`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Entity</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${entityColors[log.entity] || "bg-gray-100 text-gray-600"}`}>
                                            {log.entity}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400">Description</span>
                                        <p className="text-gray-700 text-xs mt-0.5">{log.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Time</span>
                                        <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
            </div>
        </Layout>
    );
};

export default AdminLogs;
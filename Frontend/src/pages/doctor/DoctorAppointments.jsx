import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import appointmentApi from "../../api/appointmentApi";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ date: "", status: "" });

  useEffect(() => { fetchAppointments(); }, [page, filters]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;
      const res = await appointmentApi.getAppointments(params);
      setAppointments(res.data.data);
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

  return (
    <Layout pageTitle="My Appointments">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <p className="text-gray-500 mt-1">View your appointment schedule</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 grid grid-cols-2 md:flex gap-3">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="col-span-2 md:col-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="arrived">Arrived</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <button
            onClick={() => { setFilters({ date: "", status: "" }); setPage(1); }}
            className="col-span-2 md:col-auto px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                {["Patient", "Mobile", "Date", "Time Slot", "Purpose", "Type", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader colSpan={7} />
              ) : appointments.length === 0 ? (
                <EmptyState colSpan={7} message="No appointments found" />
              ) : (
                appointments.map((apt, index) => (
                  <tr key={apt._id} className={`transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{apt.patient?.name}</p>
                          <p className="text-xs text-gray-400">{apt.patient?.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">{apt.patient?.mobile}</td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-400 text-base">calendar_today</span>
                        <span className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-orange-400 text-base">schedule</span>
                        <span className="text-sm font-medium text-gray-700">{apt.slotStart} - {apt.slotEnd}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">{apt.purpose || "-"}</td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${apt.patientType === "new" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {apt.patientType === "new" ? "New" : "Existing"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <StatusBadge status={apt.status} />
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
          ) : appointments.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">calendar_today</span>
              No appointments found
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt._id} className="p-4 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                      <p className="text-xs text-gray-400">{apt.patient?.mobile}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="mt-3 bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-gray-700 font-medium">{new Date(apt.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-gray-700 font-medium">{apt.slotStart} - {apt.slotEnd}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Purpose</p>
                    <p className="text-gray-700 font-medium">{apt.purpose || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${apt.patientType === "new" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                      {apt.patientType === "new" ? "New" : "Existing"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </div>
    </Layout>
  );
};

export default DoctorAppointments;
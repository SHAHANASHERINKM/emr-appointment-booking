import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import appointmentApi from "../../api/appointmentApi";
import patientApi from "../../api/patientApi";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({ total: 0, scheduled: 0, arrived: 0, patients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchData(); }, [page]);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [allRes, scheduledRes, arrivedRes, patientsRes] = await Promise.all([
        appointmentApi.getAppointments({ date: today, page, limit: 10 }),
        appointmentApi.getAppointments({ date: today, status: "scheduled", limit: 1 }),
        appointmentApi.getAppointments({ date: today, status: "arrived", limit: 1 }),
        patientApi.getPatientCount(),
      ]);

      setStats({
        total: allRes.data.pagination?.total || 0,
        scheduled: scheduledRes.data.pagination?.total || 0,
        arrived: arrivedRes.data.pagination?.total || 0,
        patients: patientsRes.data.count || 0,
      });

      setAppointments(allRes.data.data);
      setTotal(allRes.data.pagination?.total || 0);
      setTotalPages(allRes.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkArrived = async (id) => {
    try {
      await appointmentApi.markArrived(id);
      fetchData();
    } catch (error) {
      console.error("Mark arrived error:", error);
    }
  };

  const statCards = [
    { label: "Today's Total", value: stats.total, icon: "calendar_today", bg: "bg-blue-100", color: "text-blue-600" },
    { label: "Scheduled", value: stats.scheduled, icon: "pending_actions", bg: "bg-orange-100", color: "text-orange-600" },
    { label: "Arrived", value: stats.arrived, icon: "how_to_reg", bg: "bg-emerald-100", color: "text-emerald-600" },
    { label: "Total Patients", value: stats.patients, icon: "group", bg: "bg-purple-100", color: "text-purple-600" },
  ];

  return (
    <Layout pageTitle="Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Today's overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 md:gap-4">
            <div className={`${card.bg} ${card.color} p-2 md:p-3 rounded-xl flex-shrink-0`}>
              <span className="material-symbols-outlined text-xl md:text-3xl">{card.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs md:text-sm font-medium truncate">{card.label}</p>
              <h3 className="text-xl md:text-2xl font-bold">
                {loading ? <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div> : card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">Today's Appointments</h2>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long" })}</span>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                {["Patient", "Doctor", "Time Slot", "Purpose", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader colSpan={6} />
              ) : appointments.length === 0 ? (
                <EmptyState colSpan={6} message="No appointments today" />
              ) : (
                appointments.map((apt, index) => (
                  <tr key={apt._id} className={`group transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{apt.patient?.name}</p>
                          <p className="text-xs text-gray-400">{apt.patient?.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                          {apt.doctor?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{apt.doctor?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-orange-400 text-base">schedule</span>
                        <span className="text-sm font-medium text-gray-700">{apt.slotStart} - {apt.slotEnd}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{apt.purpose || "-"}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      {apt.status === "scheduled" && (
                        <button
                          onClick={() => handleMarkArrived(apt._id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">how_to_reg</span>
                          Mark Arrived
                        </button>
                      )}
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
              No appointments today
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
                    <p className="text-xs text-gray-400">Doctor</p>
                    <p className="text-gray-700 font-medium">{apt.doctor?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-gray-700 font-medium">{apt.slotStart} - {apt.slotEnd}</p>
                  </div>
                </div>
                {apt.status === "scheduled" && (
                  <button
                    onClick={() => handleMarkArrived(apt._id)}
                    className="mt-3 w-full flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                    Mark Arrived
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />
      </div>
    </Layout>
  );
};

export default ReceptionistDashboard;
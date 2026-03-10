import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import appointmentApi from "../../api/appointmentApi";
import userApi from "../../api/userApi";
import patientApi from "../../api/patientApi";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    receptionists: 0,
    todayAppointments: 0,
    totalPatients: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [doctorsRes, receptionistsRes, appointmentsRes, patientsRes] = await Promise.all([
        userApi.getUsers({ role: "doctor" }),
        userApi.getUsers({ role: "receptionist" }),
        appointmentApi.getAppointments({ date: today, page, limit: 10 }),
        patientApi.getPatientCount(),
      ]);

      setStats({
        doctors: doctorsRes.data.count,
        receptionists: receptionistsRes.data.count,
        todayAppointments: appointmentsRes.data.pagination?.total || 0,
        totalPatients: patientsRes.data.count,
      });

      setAppointments(appointmentsRes.data.data);
      setTotal(appointmentsRes.data.pagination?.total || 0);
      setTotalPages(appointmentsRes.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await appointmentApi.deleteAppointment(id);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const statCards = [
    { label: "Total Doctors", value: stats.doctors, icon: "stethoscope", bg: "bg-blue-100", color: "text-blue-600" },
    { label: "Total Receptionists", value: stats.receptionists, icon: "person", bg: "bg-purple-100", color: "text-purple-600" },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: "calendar_today", bg: "bg-orange-100", color: "text-orange-600" },
    { label: "Total Patients", value: stats.totalPatients, icon: "group", bg: "bg-emerald-100", color: "text-emerald-600" },
  ];

  return (
    <Layout pageTitle="Dashboard">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back, Super Admin</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 md:gap-4">
            <div className={`${card.bg} ${card.color} p-2 md:p-3 rounded-xl flex-shrink-0`}>
              <span className="material-symbols-outlined text-xl md:text-3xl">{card.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs md:text-sm font-medium truncate">{card.label}</p>
              <h3 className="text-xl md:text-2xl font-bold">
                {loading ? (
                  <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  card.value
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Today's Appointments</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <TableLoader colSpan={6} />
              ) : appointments.length === 0 ? (
                <EmptyState colSpan={6} message="No appointments today" />
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="font-medium">{apt.patient?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{apt.doctor?.name}</td>
                    <td className="px-6 py-4">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{apt.slotStart} - {apt.slotEnd}</td>
                    <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
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
              <div key={apt._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                      <p className="text-xs text-gray-500">{apt.doctor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    <button
                      onClick={() => handleDelete(apt._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-gray-700">{new Date(apt.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time Slot</p>
                    <p className="text-gray-700">{apt.slotStart} - {apt.slotEnd}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={10}
          onPageChange={setPage}
        />
      </div>

    </Layout>
  );
};

export default AdminDashboard;
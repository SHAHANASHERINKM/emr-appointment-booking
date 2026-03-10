import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import appointmentApi from "../../api/appointmentApi";
import userApi from "../../api/userApi";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmationModal";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ date: "", doctorId: "", status: "" });
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editForm, setEditForm] = useState({ purpose: "", notes: "", status: "" });

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => { fetchAppointments(); }, [page, filters]);

  const fetchDoctors = async () => {
    try {
      const res = await userApi.getUsers({ role: "doctor" });
      setDoctors(res.data.data);
    } catch (error) {
      console.error("Fetch doctors error:", error);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.date) params.date = filters.date;
      if (filters.doctorId) params.doctorId = filters.doctorId;
      if (filters.status) params.status = filters.status;

      const res = await appointmentApi.getAppointments(params);
      setAppointments(res.data.data);
      setTotal(res.data.pagination?.total || 0);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Fetch appointments error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleEdit = async () => {
    try {
      await appointmentApi.updateAppointment(selectedAppointment._id, editForm);
      setEditModal(false);
      fetchAppointments();
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentApi.deleteAppointment(selectedAppointment._id);
      setDeleteModal(false);
      fetchAppointments();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleMarkArrived = async (id) => {
    try {
      await appointmentApi.markArrived(id);
      fetchAppointments();
    } catch (error) {
      console.error("Mark arrived error:", error);
    }
  };

return (
    <Layout pageTitle="Appointments">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
        <p className="text-gray-500 mt-1">Manage all appointments</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 grid grid-cols-2 md:flex flex-wrap gap-3">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="col-span-2 md:col-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="doctorId"
            value={filters.doctorId}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>{doc.name}</option>
            ))}
          </select>
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
            onClick={() => { setFilters({ date: "", doctorId: "", status: "" }); setPage(1); }}
            className="col-span-2 md:col-auto px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Mobile</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Time Slot</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Purpose</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader colSpan={8} />
              ) : appointments.length === 0 ? (
                <EmptyState colSpan={8} message="No appointments found" />
              ) : (
                appointments.map((apt, index) => (
                  <tr
                    key={apt._id}
                    className={`group transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                          {apt.patient?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{apt.patient?.name}</p>
                          <p className="text-xs text-gray-400">{apt.patient?.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{apt.patient?.mobile}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold flex-shrink-0">
                          {apt.doctor?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{apt.doctor?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-blue-400 text-base">calendar_today</span>                        <span className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-orange-400 text-base">schedule</span>                        <span className="text-sm font-medium text-gray-700">{apt.slotStart} - {apt.slotEnd}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{apt.purpose || "-"}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {apt.status === "scheduled" && (
                          <button
                            onClick={() => handleMarkArrived(apt._id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Mark Arrived"
                          >
                            <span className="material-symbols-outlined text-lg">how_to_reg</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedAppointment(apt); setEditForm({ purpose: apt.purpose || "", notes: apt.notes || "", status: apt.status }); setEditModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => { setSelectedAppointment(apt); setDeleteModal(true); }}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
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
              No appointments found
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt._id} className="p-4 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
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
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-purple-400 text-base">person</span>
                    <div>
                      <p className="text-xs text-gray-400">Doctor</p>
                      <p className="text-gray-700 font-medium">{apt.doctor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-400 text-base">calendar_today</span>
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-gray-700 font-medium">{new Date(apt.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-orange-400 text-base">schedule</span>
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-gray-700 font-medium">{apt.slotStart} - {apt.slotEnd}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-400 text-base">medical_services</span>
                    <div>
                      <p className="text-xs text-gray-400">Purpose</p>
                      <p className="text-gray-700 font-medium">{apt.purpose || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
                  {apt.status === "scheduled" && (
                    <button
                      onClick={() => handleMarkArrived(apt._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">how_to_reg</span>
                      Arrived
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedAppointment(apt); setEditForm({ purpose: apt.purpose || "", notes: apt.notes || "", status: apt.status }); setEditModal(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => { setSelectedAppointment(apt); setDeleteModal(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Delete
                  </button>
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

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">edit_calendar</span>
              </div>
              <h3 className="text-lg font-bold">Edit Appointment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Purpose</label>
                <input
                  type="text"
                  value={editForm.purpose}
                  onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="arrived">Arrived</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Update</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <ConfirmModal
          title="Delete Appointment"
          message="Are you sure you want to delete this appointment? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      )}

    </Layout>
  );
};

export default AdminAppointments;
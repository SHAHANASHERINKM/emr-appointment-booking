import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import patientApi from "../../api/patientApi";
import Pagination from "../../components/common/Pagination";
import TableLoader from "../../components/common/TableLoader";
import EmptyState from "../../components/common/EmptyState";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "", mobile: "", email: "", dateOfBirth: "", gender: "", bloodGroup: "", address: ""
  });

  useEffect(() => {
    fetchPatients();
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPatients();
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientApi.searchPatients(search || "");
      setPatients(res.data.data);
      setTotal(res.data.count || 0);
      setTotalPages(Math.ceil((res.data.count || 0) / 10));
    } catch (error) {
      console.error("Fetch patients error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setEditForm({
      name: patient.name || "",
      mobile: patient.mobile || "",
      email: patient.email || "",
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      address: patient.address || "",
    });
    setEditModal(true);
  };

  const handleEdit = async () => {
    try {
      await patientApi.updatePatient(selectedPatient._id, editForm);
      setEditModal(false);
      fetchPatients();
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  return (
    <Layout pageTitle="Patients">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
        <p className="text-gray-500 mt-1">Manage all patients</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search by name, mobile, patient ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <TableLoader colSpan={7} />
              ) : patients.length === 0 ? (
                <EmptyState colSpan={7} message="No patients found" />
              ) : (
                patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {patient.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.mobile}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{patient.gender || "-"}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.bloodGroup || "-"}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.email || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(patient)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
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
          ) : patients.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
              No patients found
            </div>
          ) : (
            patients.map((patient) => (
              <div key={patient._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {patient.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {patient.patientId}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal(patient)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Mobile</p>
                    <p className="text-gray-700">{patient.mobile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Gender</p>
                    <p className="text-gray-700 capitalize">{patient.gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Blood Group</p>
                    <p className="text-gray-700">{patient.bloodGroup || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-700 truncate">{patient.email || "-"}</p>
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

      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Edit Patient</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Mobile", key: "mobile", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Date of Birth", key: "dateOfBirth", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-gray-700">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Blood Group</label>
                <select
                  value={editForm.bloodGroup}
                  onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={2}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default AdminPatients;
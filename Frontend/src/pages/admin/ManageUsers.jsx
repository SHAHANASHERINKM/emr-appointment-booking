import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import userApi from "../../api/userApi";
import ConfirmModal from "../../components/common/ConfirmationModal";
import UserTable from "./components/UserTable";
import DoctorFormModal from "./components/DoctorFormModel";
import ReceptionistFormModal from "./components/ReceptionistFormModel";

const defaultDoctorForm = {
  name: "", email: "", password: "", specialization: "", department: "", phone: "",
  schedule: {
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00", endTime: "17:00",
    breakStart: "13:00", breakEnd: "14:00",
    slotDuration: 15,
  }
};

const defaultReceptionistForm = {
  name: "", email: "", password: "", phone: ""
};

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState("doctor");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState(defaultDoctorForm);
  const [receptionistForm, setReceptionistForm] = useState(defaultReceptionistForm);
  const [formError, setFormError] = useState("");

  useEffect(() => { setPage(1); fetchUsers(); }, [activeTab]);
  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers({ role: activeTab, page, limit: 10 });
      setUsers(res.data.data);
      setTotal(res.data.count || 0);
      setTotalPages(Math.ceil((res.data.count || 0) / 10));
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFormError("");
    setDoctorForm(defaultDoctorForm);
    setReceptionistForm(defaultReceptionistForm);
    setModal(true);
  };

  const openEditModal = async (user) => {
    setIsEdit(true);
    setSelectedUser(user);
    setFormError("");
    if (activeTab === "doctor") {
      try {
        const res = await userApi.getDoctorSchedule(user._id);
        const schedule = res.data.data;
        setDoctorForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          specialization: user.specialization || "",
          department: user.department || "",
          phone: user.phone || "",
          schedule: {
            workingDays: schedule?.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
            startTime: schedule?.startTime || "09:00",
            endTime: schedule?.endTime || "17:00",
            breakStart: schedule?.breakStart || "13:00",
            breakEnd: schedule?.breakEnd || "14:00",
            slotDuration: schedule?.slotDuration || 15,
          }
        });
      } catch {
        setDoctorForm({ ...defaultDoctorForm, name: user.name, email: user.email, specialization: user.specialization || "", department: user.department || "", phone: user.phone || "" });
      }
    } else {
      setReceptionistForm({ name: user.name || "", email: user.email || "", password: "", phone: user.phone || "" });
    }
    setModal(true);
  };

  const handleSave = async () => {
    setFormError("");
    try {
      if (activeTab === "doctor") {
        const payload = { ...doctorForm, role: "doctor" };
        if (isEdit) { delete payload.password; await userApi.updateUser(selectedUser._id, payload); }
        else { await userApi.createUser(payload); }
      } else {
        const payload = { ...receptionistForm, role: "receptionist" };
        if (isEdit) { delete payload.password; await userApi.updateUser(selectedUser._id, payload); }
        else { await userApi.createUser(payload); }
      }
      setModal(false);
      fetchUsers();
    } catch (error) {
      setFormError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteUser(selectedUser._id);
      setDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <Layout pageTitle="Manage Users">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
          <p className="text-gray-500 mt-1">Add, edit or delete medical staff members</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add {activeTab === "doctor" ? "Doctor" : "Receptionist"}
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {["doctor", "receptionist"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "doctor" ? "Doctors" : "Receptionists"}
            </button>
          ))}
        </nav>
      </div>

      <UserTable
        users={users}
        loading={loading}
        activeTab={activeTab}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onEdit={openEditModal}
        onDelete={(user) => { setSelectedUser(user); setDeleteModal(true); }}
      />

      {modal && activeTab === "doctor" && (
        <DoctorFormModal
          isEdit={isEdit}
          form={doctorForm}
          setForm={setDoctorForm}
          onSave={handleSave}
          onClose={() => setModal(false)}
          error={formError}
        />
      )}

      {modal && activeTab === "receptionist" && (
        <ReceptionistFormModal
          isEdit={isEdit}
          form={receptionistForm}
          setForm={setReceptionistForm}
          onSave={handleSave}
          onClose={() => setModal(false)}
          error={formError}
        />
      )}

      {deleteModal && (
        <ConfirmModal
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      )}
    </Layout>
  );
};

export default ManageUsers;

import TableLoader from "../../../components/common/TableLoader";
import EmptyState from "../../../components/common/EmptyState";
import Pagination from "../../../components/common/Pagination";

const UserTable = ({ users, loading, activeTab, page, totalPages, total, onPageChange, onEdit, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">{activeTab === "doctor" ? "Specialization" : "Department"}</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <TableLoader colSpan={6} />
            ) : users.length === 0 ? (
              <EmptyState colSpan={6} message={`No ${activeTab === "doctor" ? "doctors" : "receptionists"} found`} />
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
                      {activeTab === "doctor" ? (user.specialization || "-") : (user.department || "-")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => onDelete(user)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={onPageChange} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
                  {activeTab === "doctor" ? (user.specialization || "-") : (user.department || "-")}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button onClick={() => onDelete(user)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={onPageChange} />
      </div>
    </>
  );
};

export default UserTable;
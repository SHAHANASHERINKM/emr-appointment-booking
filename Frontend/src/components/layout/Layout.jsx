import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = {
  super_admin: [
    { label: "Dashboard", icon: "dashboard", path: "/admin/dashboard" },
    { label: "Appointments", icon: "calendar_month", path: "/admin/appointments" },
    { label: "Patients", icon: "group", path: "/admin/patients" },
    { label: "Manage Users", icon: "manage_accounts", path: "/admin/users" },
  ],
  receptionist: [
    { label: "Dashboard", icon: "dashboard", path: "/receptionist/dashboard" },
    { label: "Scheduler", icon: "schedule", path: "/receptionist/scheduler" },
    { label: "Appointments", icon: "calendar_month", path: "/receptionist/appointments" },
    { label: "Patients", icon: "group", path: "/receptionist/patients" },
  ],
  doctor: [
    { label: "Dashboard", icon: "dashboard", path: "/doctor/dashboard" },
    { label: "My Appointments", icon: "calendar_month", path: "/doctor/appointments" },
  ],
};

const Layout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const items = menuItems[user?.role] || [];
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-white border-r border-gray-200 shadow-xl flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <span className="material-symbols-outlined text-white text-2xl">medical_services</span>
          </div>
          <span className="text-xl font-bold text-gray-900">EMR System</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 lg:hidden">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:pl-[250px]">

        <header className="fixed top-0 right-0 left-0 lg:left-[250px] z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 md:px-6">
          <button
            className="p-2 -ml-2 text-gray-500 hover:text-blue-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="flex-1 flex justify-center lg:justify-start lg:pl-4">
            <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-600 uppercase">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {initials}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 pt-20 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
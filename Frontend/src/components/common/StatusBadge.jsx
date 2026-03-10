const statusStyles = {
  scheduled: "bg-blue-100 text-blue-700",
  arrived: "bg-emerald-100 text-emerald-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-rose-100 text-rose-700",
  no_show: "bg-orange-100 text-orange-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
      {status?.replace("_", " ").charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
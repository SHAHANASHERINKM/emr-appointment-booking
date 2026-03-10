const EmptyState = ({ colSpan, message = "No data found" }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-gray-400">
        <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
        {message}
      </td>
    </tr>
  );
};

export default EmptyState;
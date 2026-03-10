const TableLoader = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center">
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </td>
    </tr>
  );
};

export default TableLoader;
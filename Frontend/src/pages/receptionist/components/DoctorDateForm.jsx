const DoctorDateForm = ({ doctors, doctorId, setDoctorId, date, setDate, onSearch }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
        <h3 className="font-bold text-gray-900">Select Doctor & Date</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Doctor</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}{doc.specialization ? ` - ${doc.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Date</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">event</span>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <button
          onClick={onSearch}
          disabled={!doctorId || !date}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">search</span>
          Search Available Slots
        </button>
      </div>
    </div>
  );
};

export default DoctorDateForm;
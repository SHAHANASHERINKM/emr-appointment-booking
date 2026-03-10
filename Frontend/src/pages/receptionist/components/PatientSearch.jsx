const PatientSearch = ({ searchQuery, setSearchQuery, searchResults, selectedPatient, setSelectedPatient, onSearch, newPatient, setNewPatient, patientType }) => {
  if (patientType === "new") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Patient full name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Mobile Number</label>
          <input
            type="text"
            placeholder="Mobile number"
            value={newPatient.mobile}
            onChange={(e) => setNewPatient({ ...newPatient, mobile: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by name, mobile or patient ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-4 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
        >
          Find
        </button>
      </div>

      {searchResults.length > 0 && !selectedPatient && (
        <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
          {searchResults.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelectedPatient(p)}
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-left transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.patientId} • {p.mobile}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {selectedPatient.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{selectedPatient.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{selectedPatient.patientId} • {selectedPatient.mobile}</p>
            {selectedPatient.gender && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                {selectedPatient.gender}
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
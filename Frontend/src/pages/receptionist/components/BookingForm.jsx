import PatientSearch from "./PatientSearch";

const BookingForm = ({
  selectedSlot, onChangeSlot,
  patientType, setPatientType,
  searchQuery, setSearchQuery,
  searchResults, setSearchResults,
  selectedPatient, setSelectedPatient,
  newPatient, setNewPatient,
  purpose, setPurpose,
  notes, setNotes,
  onSearch, onBook,
  bookingLoading, bookingError,
}) => {
  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
        <h3 className="font-bold text-gray-900">Patient Information</h3>
      </div>
      <div className="p-6 space-y-5">

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-600">schedule</span>
          <div>
            <p className="text-xs text-blue-600 font-semibold">Selected Slot</p>
            <p className="text-sm font-bold text-blue-800">
              {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
            </p>
          </div>
          <button
            onClick={onChangeSlot}
            className="ml-auto text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            Change
          </button>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-lg">
          {["existing", "new"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setPatientType(type);
                setSelectedPatient(null);
                setSearchResults([]);
                setSearchQuery("");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-colors ${
                patientType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              {type === "existing" ? "Existing Patient" : "New Patient"}
            </button>
          ))}
        </div>

        <PatientSearch
          patientType={patientType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          onSearch={onSearch}
          newPatient={newPatient}
          setNewPatient={setNewPatient}
        />

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Purpose of Visit</label>
          <input
            type="text"
            placeholder="e.g. Annual Checkup, Follow-up"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Notes (Optional)</label>
          <textarea
            placeholder="Additional information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {bookingError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {bookingError}
          </div>
        )}

        <button
          onClick={onBook}
          disabled={bookingLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {bookingLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              Book Appointment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
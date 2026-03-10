const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_DURATIONS = [10, 15, 20, 30, 45, 60];

const DoctorFormModal = ({ isEdit, form, setForm, onSave, onClose, error }) => {
  const toggleDay = (day) => {
    const days = form.schedule.workingDays;
    setForm({
      ...form,
      schedule: {
        ...form.schedule,
        workingDays: days.includes(day) ? days.filter((d) => d !== day) : [...days, day]
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">{isEdit ? "Edit" : "Add New"} Doctor</h3>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Specialization", key: "specialization", type: "text" },
              { label: "Department", key: "department", type: "text" },
              { label: "Phone", key: "phone", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {!isEdit && (
              <div>
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-bold text-gray-700 mb-3">Schedule</p>
            <div className="mb-3">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      form.schedule.workingDays.includes(day)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Start Time", key: "startTime" },
                { label: "End Time", key: "endTime" },
                { label: "Break Start", key: "breakStart" },
                { label: "Break End", key: "breakEnd" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <input
                    type="time"
                    value={form.schedule[key]}
                    onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, [key]: e.target.value } })}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-gray-700">Slot Duration</label>
                <select
                  value={form.schedule.slotDuration}
                  onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, slotDuration: Number(e.target.value) } })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SLOT_DURATIONS.map((d) => (
                    <option key={d} value={d}>{d} mins</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorFormModal;
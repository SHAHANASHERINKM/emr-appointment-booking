import SlotCard from "./SlotCard";

const SlotGrid = ({ slots, selectedSlot, onSelect, loading }) => {
  const morningSlots = slots.filter((s) => parseInt(s.start.split(":")[0]) < 12);
  const afternoonSlots = slots.filter((s) => parseInt(s.start.split(":")[0]) >= 12);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <span className="material-symbols-outlined text-4xl block mb-2">event_busy</span>
        No slots available for this date
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {morningSlots.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-orange-400 text-base">wb_sunny</span>
            Morning
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {morningSlots.map((slot) => (
              <SlotCard key={slot.start} slot={slot} selectedSlot={selectedSlot} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
      {afternoonSlots.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-400 text-base">light_mode</span>
            Afternoon
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {afternoonSlots.map((slot) => (
              <SlotCard key={slot.start} slot={slot} selectedSlot={selectedSlot} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotGrid;
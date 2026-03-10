const SlotCard = ({ slot, selectedSlot, onSelect }) => {
  const isSelected = selectedSlot?.start === slot.start;
  const isBooked = slot.status === "booked";

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <button
      onClick={() => onSelect(slot)}
      disabled={isBooked}
      className={`relative p-3 rounded-xl border-2 text-left transition-all w-full
        ${isSelected ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200"
        : isBooked ? "bg-gray-100 border-transparent opacity-60 cursor-not-allowed"
        : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-md"}`}
    >
      <span className={`block text-lg font-bold ${isSelected ? "text-white" : isBooked ? "text-gray-400" : "text-gray-900"}`}>
        {formatTime(slot.start)}
      </span>
      <span className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
        to {formatTime(slot.end)}
      </span>
      <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-xs font-bold rounded
        ${isSelected ? "bg-white text-blue-600"
        : isBooked ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-700"}`}>
        {isSelected ? "SELECTED" : isBooked ? "BOOKED" : "FREE"}
      </span>
    </button>
  );
};

export default SlotCard;
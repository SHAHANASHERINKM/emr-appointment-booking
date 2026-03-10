import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import userApi from "../../api/userApi";
import slotApi from "../../api/slotApi";
import patientApi from "../../api/patientApi";
import appointmentApi from "../../api/appointmentApi";
import StepIndicator from "./components/StepIndicator";
import DoctorDateForm from "./components/DoctorDateForm";
import SlotGrid from "./components/SlotGrid";
import BookingForm from "./components/BookingForm";

const Scheduler = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientType, setPatientType] = useState("existing");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({ name: "", mobile: "" });
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const res = await userApi.getUsers({ role: "doctor" });
      setDoctors(res.data.data);
      if (res.data.data.length > 0) setDoctorId(res.data.data[0]._id);
    } catch (error) {
      console.error("Fetch doctors error:", error);
    }
  };

  const fetchSlots = async () => {
    if (!doctorId || !date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setStep(2);
    try {
      const res = await slotApi.getSlots(doctorId, date);
      setSlots(res.data.data?.slots || []);
    } catch (error) {
      console.error("Fetch slots error:", error);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.status === "booked") return;
    setSelectedSlot(slot);
    setStep(3);
    setBookingError("");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await patientApi.searchPatients(searchQuery);
      setSearchResults(res.data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleBook = async () => {
    setBookingError("");
    setBookingLoading(true);
    try {
      const payload = {
        doctorId,
        date,
        slotStart: selectedSlot.start,
        slotEnd: selectedSlot.end,
        purpose,
        notes,
        patientType,
      };

      if (patientType === "existing") {
        if (!selectedPatient) { setBookingError("Please select a patient"); setBookingLoading(false); return; }
        payload.patientId = selectedPatient.patientId;
      } else {
        if (!newPatient.name || !newPatient.mobile) { setBookingError("Name and mobile are required"); setBookingLoading(false); return; }
        payload.patientName = newPatient.name;
        payload.patientMobile = newPatient.mobile;
      }

      await appointmentApi.createAppointment(payload);
      setBookingSuccess(true);
      setStep(1);
      setSelectedSlot(null);
      setSelectedPatient(null);
      setNewPatient({ name: "", mobile: "" });
      setPurpose("");
      setNotes("");
      setSearchQuery("");
      setSearchResults([]);
      setSlots([]);
      setTimeout(() => setBookingSuccess(false), 4000);
    } catch (error) {
      setBookingError(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Layout pageTitle="Scheduler">

      {bookingSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          Appointment booked successfully!
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scheduler</h2>
        <p className="text-gray-500 mt-1">Book a new appointment</p>
      </div>

      <StepIndicator step={step} />

      <div className="max-w-2xl space-y-6">

        <DoctorDateForm
          doctors={doctors}
          doctorId={doctorId}
          setDoctorId={setDoctorId}
          date={date}
          setDate={setDate}
          onSearch={fetchSlots}
        />

        {step >= 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="font-bold text-gray-900">Choose Time Slot</h3>
              {slots.length > 0 && (
                <span className="ml-auto text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  {slots.filter((s) => s.status === "available").length} slots free
                </span>
              )}
            </div>
            <div className="p-6">
              <SlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={handleSlotSelect}
                loading={slotsLoading}
              />
            </div>
          </div>
        )}

        {step >= 3 && selectedSlot && (
          <BookingForm
            selectedSlot={selectedSlot}
            onChangeSlot={() => { setSelectedSlot(null); setStep(2); }}
            patientType={patientType}
            setPatientType={setPatientType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            newPatient={newPatient}
            setNewPatient={setNewPatient}
            purpose={purpose}
            setPurpose={setPurpose}
            notes={notes}
            setNotes={setNotes}
            onSearch={handleSearch}
            onBook={handleBook}
            bookingLoading={bookingLoading}
            bookingError={bookingError}
          />
        )}

      </div>
    </Layout>
  );
};

export default Scheduler;

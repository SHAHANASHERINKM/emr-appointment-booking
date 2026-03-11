const MedicalSheet = ({ appointment }) => {
  const printSheet = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Sheet - ${appointment.patient?.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a1a; background: white; }
          .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 15mm; }
          
          .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 3px solid #2563EB; margin-bottom: 16px; }
          .hospital-info { display: flex; align-items: center; gap: 14px; }
          .logo-placeholder { width: 60px; height: 60px; border-radius: 50%; background: #2563EB; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: bold; }
          .hospital-name { font-size: 22px; font-weight: bold; color: #2563EB; }
          .hospital-sub { font-size: 11px; color: #6b7280; margin-top: 2px; }
          .sheet-title { text-align: right; }
          .sheet-title h2 { font-size: 16px; font-weight: bold; color: #1e3a5f; }
          .sheet-title p { font-size: 11px; color: #6b7280; margin-top: 3px; }

          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
          .info-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; }
          .info-card-title { font-size: 10px; font-weight: bold; color: #2563EB; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .info-label { font-size: 11px; color: #6b7280; }
          .info-value { font-size: 11px; font-weight: 600; color: #1a1a1a; }

          .section { margin-bottom: 14px; }
          .section-title { font-size: 12px; font-weight: bold; color: #1e3a5f; background: #f0f4ff; padding: 6px 12px; border-left: 4px solid #2563EB; margin-bottom: 8px; }
          
          .vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .vital-box { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; text-align: center; }
          .vital-label { font-size: 9px; color: #6b7280; text-transform: uppercase; margin-bottom: 16px; }
          .vital-unit { font-size: 9px; color: #9ca3af; margin-top: 4px; }
          .vital-line { border-bottom: 1px dashed #d1d5db; margin: 8px 0; }

          .write-area { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; min-height: 80px; }
          .write-lines { border-bottom: 1px dashed #e5e7eb; margin-bottom: 10px; height: 20px; }

          .rx-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
          .rx-symbol { font-size: 28px; font-weight: bold; color: #2563EB; font-style: italic; }
          .rx-table { width: 100%; border-collapse: collapse; }
          .rx-table th { background: #f8faff; border: 1px solid #e5e7eb; padding: 6px 10px; font-size: 10px; color: #6b7280; text-align: left; }
          .rx-table td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 11px; height: 28px; }

          .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature-box { text-align: center; }
          .signature-line { border-bottom: 1px solid #1a1a1a; width: 160px; margin-bottom: 5px; height: 40px; }
          .signature-label { font-size: 10px; color: #6b7280; }

          .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: bold; }
          .badge-blue { background: #dbeafe; color: #1d4ed8; }
          .badge-green { background: #d1fae5; color: #065f46; }

          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(37, 99, 235, 0.04); font-weight: bold; pointer-events: none; z-index: 0; }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none; }
            .page { padding: 10mm; }
          }
        </style>
      </head>
      <body>
        <div class="watermark">EMR</div>
        <div class="page">

          <!-- Header -->
          <div class="header">
            <div class="hospital-info">
              <div class="logo-placeholder">H</div>
              <div>
                <div class="hospital-name"> EMR System</div>
                <div class="hospital-sub">Electronic Medical Records System</div>
                <div class="hospital-sub">Tel: +91 00000 00000 | info@emr.com</div>
              </div>
            </div>
            <div class="sheet-title">
              <h2>MEDICAL SHEET</h2>
              <p>Date: ${new Date(appointment.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p>Ref: ${appointment._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <!-- Patient & Doctor Info -->
          <div class="info-grid">
            <div class="info-card">
              <div class="info-card-title">Patient Information</div>
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${appointment.patient?.name || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Patient ID</span>
                <span class="info-value">${appointment.patient?.patientId || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Mobile</span>
                <span class="info-value">${appointment.patient?.mobile || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Gender</span>
                <span class="info-value" style="text-transform: capitalize">${appointment.patient?.gender || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Type</span>
                <span class="badge badge-blue">${appointment.patientType === "new" ? "NEW PATIENT" : "EXISTING PATIENT"}</span>
              </div>
            </div>

            <div class="info-card">
              <div class="info-card-title">Appointment Details</div>
              <div class="info-row">
                <span class="info-label">Doctor</span>
                <span class="info-value">${appointment.doctor?.name || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Specialization</span>
                <span class="info-value">${appointment.doctor?.specialization || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Department</span>
                <span class="info-value">${appointment.doctor?.department || "-"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time Slot</span>
                <span class="info-value">${appointment.slotStart} - ${appointment.slotEnd}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Purpose</span>
                <span class="info-value">${appointment.purpose || "-"}</span>
              </div>
            </div>
          </div>

          <!-- Vitals -->
          <div class="section">
            <div class="section-title">Vitals (To be filled by Nurse)</div>
            <div class="vitals-grid">
              <div class="vital-box">
                <div class="vital-label">Blood Pressure</div>
                <div class="vital-line"></div>
                <div class="vital-unit">mmHg</div>
              </div>
              <div class="vital-box">
                <div class="vital-label">Temperature</div>
                <div class="vital-line"></div>
                <div class="vital-unit">°F</div>
              </div>
              <div class="vital-box">
                <div class="vital-label">Pulse Rate</div>
                <div class="vital-line"></div>
                <div class="vital-unit">bpm</div>
              </div>
              <div class="vital-box">
                <div class="vital-label">Weight</div>
                <div class="vital-line"></div>
                <div class="vital-unit">kg</div>
              </div>
            </div>
          </div>

          <!-- Chief Complaint -->
          <div class="section">
            <div class="section-title">Chief Complaint / Symptoms</div>
            <div class="write-area">
              <div class="write-lines"></div>
              <div class="write-lines"></div>
              <div class="write-lines"></div>
            </div>
          </div>

          <!-- Prescription -->
          <div class="section">
            <div class="section-title">Prescription</div>
            <div class="rx-header">
              <span class="rx-symbol">Rx</span>
            </div>
            <table class="rx-table">
              <thead>
                <tr>
                  <th style="width:5%">#</th>
                  <th style="width:35%">Medicine Name</th>
                  <th style="width:20%">Dosage</th>
                  <th style="width:20%">Frequency</th>
                  <th style="width:20%">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>2</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>3</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>4</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>5</td><td></td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>

          <!-- Doctor Notes -->
          <div class="section">
            <div class="section-title">Doctor's Notes / Advice</div>
            <div class="write-area">
              <div class="write-lines"></div>
              <div class="write-lines"></div>
            </div>
          </div>

          <!-- Follow Up & Signature -->
          <div class="footer">
            <div>
              <div class="section-title" style="margin-bottom: 8px">Follow Up</div>
              <div style="display: flex; gap: 20px; font-size: 11px;">
                <span>Date: ____________________</span>
                <span>After: ____ Days / Weeks</span>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-label">Doctor's Signature & Stamp</div>
              <div class="signature-label" style="margin-top: 2px; font-weight: bold;">${appointment.doctor?.name || ""}</div>
            </div>
          </div>

        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button
      onClick={printSheet}
      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      title="Print Medical Sheet"
    >
      <span className="material-symbols-outlined text-base">print</span>
      Print Sheet
    </button>
  );
};

export default MedicalSheet;
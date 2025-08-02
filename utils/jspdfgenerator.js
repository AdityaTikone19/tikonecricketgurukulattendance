import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

autoTable(jsPDF); // ✅ Attach plugin manually

export function generatePDF({ title, columns, rows }) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(title || "Attendance Report", 14, 20);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: 'center',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      bodyStyles: { halign: 'center' },
    });

    const fileName = `${(title || "attendance_report")
      .replace(/\s+/g, "_")
      .toLowerCase()}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("Error in generateAttendancePDF:", err);
    throw err; 
  }
}
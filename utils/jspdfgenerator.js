import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * @param {Object} param0
 * @param {string} param0.title
 * @param {string[]} param0.columns
 * @param {Array[]} param0.rows
 */
export function generatePDF({ title, columns, rows }) {
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
}
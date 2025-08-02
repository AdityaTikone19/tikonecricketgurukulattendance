import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { logoBase64 } from "./logo"; // Your logo string

export function generatePDF({ title, columns, rows }) {
  try {
    if (!rows || rows.length === 0) {
      alert("No attendance data to export.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const currentDate = moment().format("MMMM Do YYYY, h:mm A");

    // 🔹 Header with Logo, Title, and Date
    const logoWidth = 30;
    const logoHeight = 15;
    doc.addImage(logoBase64, "JPEG", 10, 10, logoWidth, logoHeight);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Tikone Cricket Gurukul", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(currentDate, pageWidth - 10, 15, { align: "right" });

    // 🔹 Title below header
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text(title || "Attendance Report", pageWidth / 2, 30, { align: "center" });

    // 🔹 Table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 10, halign: "center" },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40 },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        const page = doc.internal.getCurrentPageInfo().pageNumber;

        // 🔹 Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Computerized Generated PDF on ${currentDate}`,
          10,
          pageHeight - 10
        );
        doc.text(
          `Page ${page} of ${pageCount}`,
          pageWidth - 10,
          pageHeight - 10,
          { align: "right" }
        );

        // 🔹 Watermark
        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("Tikone Gurukul", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: 45,
        });
      },
    });

    // 🔹 Save file
    const fileName = `${(title || "attendance_report")
      .replace(/\s+/g, "_")
      .toLowerCase()}.pdf`;
    doc.save(fileName);

  } catch (err) {
    console.error("❌ Error in generatePDF:", err.message, err.stack);
    alert("Failed to generate PDF: " + err.message);
  }
}
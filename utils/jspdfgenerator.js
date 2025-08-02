import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { logoBase64 } from "./logo"; // Ensure base64 image is imported

export function generatePDF({ title, columns, rows }) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = moment().format("MMMM Do YYYY, h:mm A");

    // 🔹 Add logo
    const logoWidth = 30;
    doc.addImage(logoBase64, "PNG", 10, 10, logoWidth, 15);

    // 🔹 Brand name
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Tikone Cricket Gurukul", pageWidth / 2, 20, { align: "center" });

    // 🔹 Current date on top-right
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(currentDate, pageWidth - 10, 15, { align: "right" });

    // 🔹 Title
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text(title || "Attendance Report", pageWidth / 2, 30, {
      align: "center",
    });

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
        // 🔹 Footer
        const pageCount = doc.internal.getNumberOfPages();
        const page = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Computerized Generated PDF on ${currentDate}`,
          10,
          doc.internal.pageSize.getHeight() - 10
        );
        doc.text(
          `Page ${page} of ${pageCount}`,
          pageWidth - 10,
          doc.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );

        // 🔹 Optional watermark
        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("Tikone Gurukul", pageWidth / 2, 130, {
          align: "center",
          angle: 45,
        });
      },
    });

    const fileName = `${(title || "attendance_report")
      .replace(/\s+/g, "_")
      .toLowerCase()}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("❌ Error in generatePDF:", err);
    alert("Failed to generate PDF.");
  }
}
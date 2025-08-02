import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { logoBase64 } from "./logo";

export function generatePDF({ title, columns, rows }) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = moment().format("MMMM Do YYYY, h:mm A");

    // 🟦 Logo
    const logoWidth = 30;
    doc.addImage(logoBase64, "JPEG", 10, 10, logoWidth, 15);

    // 🟦 Brand Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Tikone Cricket Gurukul", pageWidth / 2, 20, { align: "center" });

    // 🟦 Date on Top Right
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(currentDate, pageWidth - 10, 15, { align: "right" });

    // 🟦 Title
    doc.setFontSize(14);
    doc.setTextColor(51);
    doc.setFont("helvetica", "bold");
    doc.text(title || "Attendance Report", pageWidth / 2, 35, {
      align: "center",
    });

    // 🟦 Watermark (before table)
    doc.setTextColor(200);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("Tikone Gurukul", pageWidth / 2, 150, {
      align: "center",
      angle: 45,
      opacity: 0.1,
    });

    // 🟦 Table
    autoTable(doc, {
      startY: 45,
      head: [columns],
      body: rows,
      styles: {
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 45 },
      didDrawPage: function (data) {
        // Footer
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
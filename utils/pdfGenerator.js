import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import { logoBase64 } from "./logo.js"; 

pdfMake.vfs = pdfFonts.vfs;

export function generateAttendancePDF({ title, columns, rows }) {
  if (!rows || rows.length === 0) {
    alert("No attendance data to export.");
    return;
  }

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  const docDefinition = {
    content: [
      {
        columns: [
          {
            image: logoBase64,
            width: 60,
            margin: [0, 0, 0, 10],
          },
          {
            width: '*',
            text: 'Tikone Cricket Gurukul',
            style: 'brand',
            alignment: 'center',
            margin: [60, 15, 0, 10],
          },
          {
            width: 100,
            text: currentDate,
            alignment: 'right',
            margin: [0, 15, 0, 10],
            fontSize: 8,
            color: '#666',
          },
        ],
      },
      {
        text: title,
        style: "header",
        alignment: "center",
        margin: [0, 10, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(columns.length).fill("*"),
          body: [columns, ...rows],
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      brand: {
        fontSize: 18,
        bold: true,
      },
      header: {
        fontSize: 16,
        bold: true,
        color: "#333",
      },
    },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: `Computerized Generated PDF on ${currentDate}`,
            alignment: 'left',
            fontSize: 8,
            margin: [40, 0],
            color: '#888',
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'right',
            fontSize: 8,
            margin: [0, 0, 40, 0],
            color: '#888',
          },
        ],
      };
    },
    watermark: {
      text: 'Tikone Gurukul',
      color: 'gray',
      opacity: 0.1,
      bold: true,
      italics: false,
    },
  };

  pdfMake.createPdf(docDefinition).download(`${title}.pdf`);
}
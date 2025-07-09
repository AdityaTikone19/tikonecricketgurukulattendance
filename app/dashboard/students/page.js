"use client";
import React, { useEffect, useState } from "react";
import AddNewStudent from "./_components/AddNewStudent";
import StudentListTable from "./_components/StudentListTable";
import GlobalApi from "@/app/_services/GlobalApi";
import { DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logoBase64 } from "@/utils/logo.js";

function Student() {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    GetAllStudents();
  }, []);

  const GetAllStudents = () => {
    GlobalApi.GetAllStudents().then((resp) => {
      setStudentList(resp.data);
    });
  };

  const handleDownloadAllPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height;
    doc.text("All Students", 14, 40);

    const currentDate = new Date().toLocaleDateString();

    const tableData = studentList.map((student, index) => [
      index + 1,
      student.name,
      student.grade,
      student.age,
      student.contact,
      student.email,
      student.dateOfBirth,
      student.address,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["#", "Name", "Age Group", "Age", "Contact", "Email", "DOB", "Address"]],
      body: tableData,
      didDrawPage: function (data) {
        doc.addImage(logoBase64, "JPEG", 14, 10, 20, 20);

        doc.setFontSize(16);
        doc.text("Tikone Cricket Gurukul", pageWidth / 2, 20, { align: "center" });

        doc.saveGraphicsState();
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(50);
        doc.setFont("helvetica", "bold");
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.text("Tikone Cricket Gurukul", pageWidth / 2, pageHeight / 2, {
          angle: 45,
          align: "center",
        });
        doc.restoreGraphicsState();

        doc.setFontSize(10);
        doc.text(
          `Computerized Generated PDF Downloaded on: ${currentDate}`,
          14,
          pageHeight - 10
        );
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageSize.width - 30,
          pageHeight - 10
        );
      },
    });

    doc.save("all-students.pdf");
  };

  return (
    <div className="p-4 sm:p-6 md:p-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="font-bold text-2xl">Students</h2>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <AddNewStudent refreshData={GetAllStudents} />
          <button
            onClick={handleDownloadAllPdf}
            className="text-sm bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <DownloadIcon size={16} /> Download All
          </button>
        </div>
      </div>

      <StudentListTable studentList={studentList} refreshData={GetAllStudents} />
    </div>
  );
}

export default Student;
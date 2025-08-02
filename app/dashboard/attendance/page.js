"use client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generateAttendancePDF } from "@/utils/pdfGenerator";
import GradeSelect from '@/app/_components/GradeSelect';
import MonthSelection from '@/app/_components/MonthSelection';
import GlobalApi from '@/app/_services/GlobalApi';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import React, { useState } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { generatePDF } from "@/utils/jspdfgenerator";
import AttendanceGrid from './_components/AttendanceGrid';

pdfMake.vfs = pdfFonts.vfs;

function Attendance() {
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedGrade, setSelectedGrade] = useState();
    const [attendanceList, setAttendanceList] = useState();
    const [isDownloading, setIsDownloading] = useState(false); // loading state

    const onSearchHandler = () => {
        const month = moment(selectedMonth).format('MM/YYYY');
        GlobalApi.GetAttendanceList(selectedGrade, month).then((resp) => {
            setAttendanceList(resp.data);
        });
    };

    const handleDownloadAllAttendance = async () => {
        try {
            setIsDownloading(true);

            const response = await GlobalApi.GetAllAttendance();
            const data = response.data;

            if (!data || data.length === 0) {
                alert("No attendance record found.");
                return;
            }

            const columns = ["Student ID", "Name", "Grade", "Date", "Day", "Status"];
            const rows = data.map((item) => [
                item.studentId || "N/A",
                item.name || "N/A",
                item.grade || "N/A",
                item.date || "N/A",
                item.day || "N/A",
                item.present === true
                    ? "Present"
                    : item.present === false
                        ? "Absent"
                        : "No Record",
            ]);

            // ✅ Add try/catch here
            try {
                generatePDF({
                    title: "All Attendance Records",
                    columns,
                    rows,
                });
            } catch (pdfErr) {
                console.error("❌ PDF generation error:", pdfErr);
                alert("Error inside PDF generator");
            }

        } catch (error) {
            console.error("❌ Error fetching attendance:", error);
            alert("Failed to fetch attendance data.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!attendanceList || attendanceList.length === 0) {
            alert("No attendance data to export.");
            return;
        }

        const columns = ["Student ID", "Name", "Grade", "Date", "Day", "Status"];
        const rows = attendanceList.map((item) => [
            item.studentId || "N/A",
            item.name || "N/A",
            item.grade || "N/A",
            item.date || "N/A",
            item.day || "N/A",
            item.present ? "Present" : "Absent",
        ]);

        generateAttendancePDF({
            title: "Attendance Report",
            columns,
            rows,
        });
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold'>Attendance</h2>

            <div className='flex gap-5 my-5 p-5 border rounded-lg shadow-sm flex-wrap'>
                <div className='flex gap-2 items-center'>
                    <label>Select Month:</label>
                    <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
                </div>
                <div className='flex gap-2 items-center'>
                    <label>Select Age Group:</label>
                    <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                </div>
                <Button onClick={onSearchHandler}>Search</Button>
            </div>

            <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} />

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
                <Button
                    onClick={handleDownloadPDF}
                    className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                >
                    Download PDF
                </Button>
                <Button
                    onClick={handleDownloadAllAttendance}
                    className="bg-slate-600 hover:bg-slate-400 w-full md:w-auto"
                    disabled={isDownloading}
                >
                    {isDownloading ? "Downloading..." : "Download All Attendance PDF"}
                </Button>
            </div>
        </div>
    );
}

export default Attendance;
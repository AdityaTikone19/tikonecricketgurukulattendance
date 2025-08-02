"use client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generateAttendancePDF } from "@/utils/pdfGenerator";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GradeSelect from '@/app/_components/GradeSelect';
import MonthSelection from '@/app/_components/MonthSelection';
import GlobalApi from '@/app/_services/GlobalApi';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import React, { useState } from 'react';
import AttendanceGrid from './_components/AttendanceGrid';

pdfMake.vfs = pdfFonts.vfs;

function Attendance() {
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedGrade, setSelectedGrade] = useState();
    const [attendanceList, setAttendanceList] = useState();
    const [isDownloading, setIsDownloading] = useState(false); 

    const onSearchHandler = () => {
        const month = moment(selectedMonth).format('MM/YYYY');
    
        const toastId = toast.loading("Fetching attendance...");
    
        GlobalApi.GetAttendanceList(selectedGrade, month).then((resp) => {
            setAttendanceList(resp.data);
            toast.success("Attendance loaded", { id: toastId });
        }).catch(() => {
            toast.error("Failed to load attendance", { id: toastId });
        });
    };
    const router = useRouter();

    useEffect(() => {
    const handleFocus = () => {
        if (selectedGrade && selectedMonth) {
            onSearchHandler();
        }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
}, [selectedGrade, selectedMonth]);

const handleDownloadAllAttendance = async () => {
    const toastId = toast.loading("Generating PDF...");

    try {
        // ✅ Wait briefly to let DB changes settle
        await new Promise(resolve => setTimeout(resolve, 300));

        const response = await GlobalApi.GetAllAttendance(); // uses cache-busting
        const data = response.data;

        if (!data || data.length === 0) {
            toast.error("No attendance record found", { id: toastId });
            return;
        }

        const columns = ["Student ID", "Name", "Grade", "Date", "Day", "Present"];
        const rows = data.map((item) => [
            item.studentId || "N/A",
            item.name || "N/A",
            item.grade || "N/A",
            item.date || "N/A",
            item.day || "N/A",
            item.present,
        ]);

        generateAttendancePDF({
            title: "All Attendance Records",
            columns,
            rows,
        });

        toast.success("PDF generated", { id: toastId });
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF", { id: toastId });
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
                >
                    Download All Attendance PDF
                </Button>
                <Button
                    onClick={onSearchHandler}
                    className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                >
                    🔄 Refresh Attendance
                </Button>
            </div>
        </div>
    );
}

export default Attendance;
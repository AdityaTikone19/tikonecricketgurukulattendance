"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import MonthSelection from "../_components/MonthSelection";
import GradeSelect from "../_components/GradeSelect";
import moment from "moment";
import GlobalApi from "../_services/GlobalApi";
import StatusList from "./_components/StatusList";
import BarChartComponent from "./_components/BarChartComponent";
import PieChartComponent from "./_components/PieChartComponent";

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedGrade, setSelectedGrade] = useState("U-10(B)");
  const [attendanceList, setAttendanceList] = useState();
  const [totalPresentData, setTotalPresentData] = useState([]);

  const { setTheme } = useTheme();

  useEffect(() => {
    GetTotalPresentCountByDay();
    getStudentAttendance();
  }, [selectedMonth, selectedGrade]);

  const getStudentAttendance = () => {
    GlobalApi.GetAttendanceList(
      selectedGrade,
      moment(selectedMonth).format("MM/yyyy")
    ).then((resp) => {
      setAttendanceList(resp.data);
    });
  };

  const GetTotalPresentCountByDay = () => {
    GlobalApi.TotalPresentCountByDay(
      moment(selectedMonth).format("MM/yyyy"),
      selectedGrade
    ).then((resp) => {
      setTotalPresentData(resp.data);
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="font-bold text-xl sm:text-2xl">Dashboard</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <MonthSelection selectedMonth={setSelectedMonth} />
          <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
        </div>
      </div>

      <StatusList attendanceList={attendanceList} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <BarChartComponent
            attendanceList={attendanceList}
            totalPresentData={totalPresentData}
          />
        </div>
        <div>
          <PieChartComponent attendanceList={attendanceList} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import { getUniqueRecord } from '@/app/_services/service';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

function BarChartComponent({ attendanceList, totalPresentData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    formatAttendanceListCount();
  }, [attendanceList, totalPresentData]); // ✅ Fixed dependency array

  const formatAttendanceListCount = () => {
    const totalStudent = getUniqueRecord(attendanceList);

    const result = totalPresentData.map(item => ({
      day: item.day,
      presentCount: item.presentCount,
      absentCount: Number(totalStudent?.length) - Number(item.presentCount)
    }));

    setData(result);
  };

  return (
    <div className="p-4 md:p-5 border rounded-lg shadow-sm">
      <h2 className="text-base md:text-lg font-bold mb-4">Attendance</h2>
      
      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="presentCount" name="Total Present" fill="#8884d8" />
            <Bar dataKey="absentCount" name="Total Absent" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartComponent;
import { getUniqueRecord } from '@/app/_services/service';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

function PieChartComponent({ attendanceList }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const totalSt = getUniqueRecord(attendanceList);
      const today = moment().format('D');
      const presentPercentage = (attendanceList.length / (totalSt.length * Number(today))) * 100;

      setData([
        {
          name: 'Total Present',
          value: Number(presentPercentage.toFixed(1)),
          fill: '#4c8cf8',
        },
        {
          name: 'Total Absent',
          value: 100 - Number(presentPercentage.toFixed(1)),
          fill: '#1fe6d1',
        },
      ]);
    }
  }, [attendanceList]);

  return (
    <div className="border p-4 md:p-5 rounded-lg shadow-sm">
      <h2 className="font-bold text-base md:text-lg mb-4">Monthly Attendance</h2>
      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartComponent;
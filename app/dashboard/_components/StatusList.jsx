import { getUniqueRecord } from '@/app/_services/service';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';

function StatusList({ attendanceList }) {
  const [totalStudent, setTotalStudent] = useState(0);
  const [presentPerc, setPresentPerc] = useState(0);

  useEffect(() => {
    if (attendanceList) {
      const totalSt = getUniqueRecord(attendanceList) || [];
      setTotalStudent(totalSt.length);

      const today = Number(moment().format('D'));
      const totalRecords = totalSt.length * today;

      if (totalRecords > 0) {
        const presentPercentage = (attendanceList.length / totalRecords) * 100;
        setPresentPerc(presentPercentage);
      } else {
        setPresentPerc(0);
      }
    }
  }, [attendanceList]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      <Card icon={<GraduationCap size={24} />} title="Total Student" value={totalStudent} />
      <Card icon={<TrendingUp size={24} />} title="Total Present" value={presentPerc.toFixed(1) + '%'} />
      <Card icon={<TrendingDown size={24} />} title="Total Absent" value={(100 - presentPerc).toFixed(1) + '%'} />
    </div>
  );
}

export default StatusList;
import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

function AttendanceGrid({ attendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: 'studentId', filter: true },
    { field: 'name', filter: true },
  ]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const numberOfDays = daysInMonth(
    moment(selectedMonth).year(),
    moment(selectedMonth).month()
  );
  const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  useEffect(() => {
    if (attendanceList) {
      const userList = getUniqueRecord();
      setRowData(userList);

      daysArrays.forEach((date) => {
        setColDefs((prevData) => [
          ...prevData,
          {
            field: date.toString(),
            width: 50,
            editable: true,
          },
        ]);

        userList.forEach((obj) => {
          obj[date] = isPresent(obj.studentId, date);
        });
      });
    }
  }, [attendanceList]);

  const isPresent = (studentId, day) => {
    const result = attendanceList.find(
      (item) => item.day == day && item.studentId == studentId
    );
    return result ? true : false;
  };

  const getUniqueRecord = () => {
    const uniqueRecord = [];
    const existingUser = new Set();

    attendanceList?.forEach((record) => {
      if (!existingUser.has(record.studentId)) {
        existingUser.add(record.studentId);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };

  const onMarkAttendance = (day, studentId, presentStatus) => {
    const date = moment(selectedMonth).format('DD/MM/YYYY');

    const student = rowData.find((item) => item.studentId === studentId);

    if (!student || !student.email) {
      console.error('Student data or email not found for ID:', studentId);
      return;
    }

    const attendanceData = {
      day,
      studentId,
      present: presentStatus,
      date: moment(selectedMonth).format('MM/YYYY'),
    };

    if (presentStatus) {
      GlobalApi.MarkAttendance(attendanceData).then((resp) => {
        toast(`Student ${student.name} marked as Present`);

        fetch('/api/send-attendance-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: student.name,
            email: student.email,
            status: 'Present',
            date,
          }),
        });
      });
    } else {
      GlobalApi.MarkAbsent(studentId, day, attendanceData.date).then((resp) => {
        toast(`Student ${student.name} marked as Absent`);

        fetch('/api/send-attendance-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: student.name,
            email: student.email,
            status: 'Absent',
            date,
          }),
        });
      });
    }
  };

  return (
    <div className="w-full overflow-x-auto mt-6">
      <div className="ag-theme-quartz min-w-[600px]" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          onCellValueChanged={(e) =>
            onMarkAttendance(e.colDef.field, e.data.studentId, e.newValue)
          }
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
    </div>
  );
}

export default AttendanceGrid;
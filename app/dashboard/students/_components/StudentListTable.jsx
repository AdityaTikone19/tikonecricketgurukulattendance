import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Search, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import GlobalApi from '@/app/_services/GlobalApi';

ModuleRegistry.registerModules([AllCommunityModule]);

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

function StudentListTable({ studentList, refreshData }) {

  const CustomButtons = (props) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button size="sm" variant="destructive">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your record
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => DeleteRecord(props?.data?.id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const [colDefs] = useState([
    { field: "id", filter: true },
    { field: "name", filter: true },
    { field: "address", filter: true },
    { field: "contact", filter: true },
    { field: "email", filter: true },
    { field: "age", filter: true },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      filter: true,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return isNaN(date) ? "" : date.toLocaleDateString();
      },
    },
    { field: 'action', cellRenderer: CustomButtons }
  ]);

  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState();

  useEffect(() => {
    if (studentList) setRowData(studentList);
  }, [studentList]);

  const DeleteRecord = (id) => {
    GlobalApi.DeleteStudentRecord(studentId).then(() => {
      toast.success("Student deleted");
      refreshData(); 
    });
  };

  return (
    <div className='my-7 w-full'>
      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto">
        <div className="ag-theme-quartz min-w-[600px]" style={{ height: 500 }}>
          {/* Responsive Search Bar */}
          <div className='p-2 rounded-lg border shadow-sm flex flex-wrap gap-2 mb-4 w-full max-w-full sm:max-w-sm'>
            <Search />
            <input
              type='text'
              placeholder='Search on Anything....'
              className='outline-none w-full'
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
  
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            quickFilterText={searchInput}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
}

export default StudentListTable;
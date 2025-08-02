"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

function AddNewStudent({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    GetAllGradesList();
  }, []);

  const GetAllGradesList = () => {
    GlobalApi.GetAllGrades().then((resp) => {
      setGrades(resp.data);
    });
  };

  const dateOfBirth = watch("dateOfBirth");

  useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age !== null) {
        setValue("age", `${age} Years Old`);
      }
    }
  }, [dateOfBirth, setValue]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 && age <= 120 ? age : null;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    GlobalApi.CreateNewStudent(data).then(async (resp) => {
      if (resp.data) {
        await fetch("/api/send-student-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name, email: data.email }),
        });

        reset();
        setOpen(false);
        toast.success('New Student Added!');

        // 🔁 Refresh attendance list or PDF data
        if (typeof refreshData === 'function') {
          refreshData();
        }
      }
      setLoading(false);
    });
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add New Student</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Full Name</label>
                  <Input
                    placeholder="Ex. Carl Max"
                    {...register("name", { required: true })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Select Age Group</label>
                  <select
                    className="p-3 border rounded-lg"
                    {...register("grade", { required: true })}
                  >
                    {grades.map((item, index) => (
                      <option key={index} value={item.grade}>
                        {item.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Ex. student@example.com"
                    {...register("email", { required: true })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Contact Number</label>
                  <Input
                    type="number"
                    placeholder="Ex. 9999999999"
                    {...register("contact", { required: true })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Age</label>
                  <Input
                    readOnly
                    value={watch("age") || ""}
                    placeholder="Age auto-filled from DOB"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    {...register("dateOfBirth", { required: true })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Address</label>
                  <Input
                    placeholder="Ex. St.Street 567 North Bay, California"
                    {...register("address", { required: true })}
                  />
                </div>

                <div className="flex gap-3 items-center justify-end mt-5">
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewStudent;

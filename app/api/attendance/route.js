import { and, eq, isNull, or } from "drizzle-orm"; 
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { NextResponse } from "next/server";


export async function GET(req){

    const searchParams=req.nextUrl.searchParams;
    const grade=searchParams.get('grade');
    const month=searchParams.get('month')

    const result=await db.select({
        name:STUDENTS.name,
        email: STUDENTS.email,
        present:ATTENDANCE.present,
        day:ATTENDANCE.day,
        date:ATTENDANCE.date,
        grade:STUDENTS.grade,
        studentId:STUDENTS.id,
        attendanceId:ATTENDANCE.id
    }).from(STUDENTS)
    .leftJoin(ATTENDANCE, and(
        eq(STUDENTS.id, ATTENDANCE.studentId),
        eq(ATTENDANCE.date, month)
      ))
    .where(eq(STUDENTS.grade,grade))
    

    return NextResponse.json(result);
}

export async function POST(req, res) {
    const data = await req.json(); // Expecting an array of records
  
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
  
    try {
      const result = await db.insert(ATTENDANCE).values(data);
      return NextResponse.json({ success: true, inserted: result });
    } catch (error) {
      console.error("❌ Attendance insert failed:", error);
      return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
    }
  }

export async function DELETE(req){

    const searchParams=req.nextUrl.searchParams;
    const studentId=searchParams.get('studentId');
    const date=searchParams.get('date');
    const day=searchParams.get('day');


    const result=await db.delete(ATTENDANCE)
    .where(
        and(
            eq(ATTENDANCE.studentId,studentId),
            eq(ATTENDANCE.day,day),
            eq(ATTENDANCE.date,date)
        )
     )
    

    return NextResponse.json(result);
}
    

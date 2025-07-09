import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const records = await db
      .select({
        studentId: STUDENTS.id,
        name: STUDENTS.name,
        grade: STUDENTS.grade,
        date: ATTENDANCE.date,
        day: ATTENDANCE.day,
        present: ATTENDANCE.present,
      })
      .from(STUDENTS)
      .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId));

    // Convert null attendance fields to safe values
    const safeRecords = records.map((r) => ({
      studentId: r.studentId,
      name: r.name,
      grade: r.grade,
      date: r.date ?? "N/A",
      day: r.day ?? "N/A",
      present: r.present ?? false,
    }));

    return NextResponse.json(safeRecords);
  } catch (err) {
    console.error("❌ Failed to fetch all attendance:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

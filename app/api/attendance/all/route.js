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
      .innerJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId)); // <- INNER JOIN here

    return NextResponse.json(records); // no need to sanitize, all data is guaranteed
  } catch (err) {
    console.error("❌ Failed to fetch all attendance:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

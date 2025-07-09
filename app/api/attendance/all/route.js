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

    // If no attendance exists for a student, return one row with date/day/present = "N/A"
    const groupedByStudent = new Map();

    for (const record of records) {
      if (!groupedByStudent.has(record.studentId)) {
        groupedByStudent.set(record.studentId, []);
      }

      groupedByStudent.get(record.studentId).push({
        studentId: record.studentId,
        name: record.name,
        grade: record.grade,
        date: record.date ?? "N/A",
        day: record.day ?? "N/A",
        present: record.present === true ? "Present" : record.present === false ? "Absent" : "No Record",
      });
    }

    // Flatten all records (even if some students only have one "No Record")
    const finalList = Array.from(groupedByStudent.values()).flat();

    return NextResponse.json(finalList);
  } catch (err) {
    console.error("❌ Failed to fetch all attendance:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

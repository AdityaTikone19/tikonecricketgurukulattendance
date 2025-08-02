import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    console.log("📥 Fetching all attendance at", new Date().toISOString());

    // Use INNER JOIN to exclude orphaned records
    const records = await db
      .select({
        studentId: STUDENTS.id,
        name: STUDENTS.name,
        grade: STUDENTS.grade,
        date: ATTENDANCE.date,
        day: ATTENDANCE.day,
        present: ATTENDANCE.present,
      })
      .from(ATTENDANCE)
      .innerJoin(STUDENTS, eq(STUDENTS.id, ATTENDANCE.studentId));

    // Sort by most recent
    const sortedList = records.sort(
      (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    );

    const cleanedList = sortedList.map((record) => ({
      studentId: record.studentId,
      name: record.name,
      grade: record.grade,
      date: record.date ?? "N/A",
      day: record.day ?? "N/A",
      present:
        record.present === true
          ? "Present"
          : record.present === false
          ? "Absent"
          : "No Record",
    }));

    return new NextResponse(JSON.stringify(cleanedList), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("❌ Failed to fetch all attendance:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

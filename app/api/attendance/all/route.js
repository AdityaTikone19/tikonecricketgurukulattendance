import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { eq } from "drizzle-orm";

// ⬅️ This line disables static rendering and forces fresh data
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("📥 Fetching all attendance at", new Date().toISOString());

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
        present:
          record.present === true
            ? "Present"
            : record.present === false
            ? "Absent"
            : "No Record",
      });
    }

    const finalList = Array.from(groupedByStudent.values())
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // optional: sort newest first

    return new NextResponse(JSON.stringify(finalList), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // 🛑 This disables browser/server caching
      },
    });
  } catch (err) {
    console.error("❌ Failed to fetch all attendance:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
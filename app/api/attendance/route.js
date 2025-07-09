import { and, eq, or, like, isNull } from "drizzle-orm"; 
import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const grade = searchParams.get('grade');
    const month = searchParams.get('month'); // expected as MM/YYYY

    try {
        const result = await db.select({
            name: STUDENTS.name,
            email: STUDENTS.email,
            present: ATTENDANCE.present,
            day: ATTENDANCE.day,
            date: ATTENDANCE.date,
            grade: STUDENTS.grade,
            studentId: STUDENTS.id,
            attendanceId: ATTENDANCE.id
        })
        .from(STUDENTS)
        .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId))
        .where(
            and(
                eq(STUDENTS.grade, grade),
                or(
                    like(ATTENDANCE.date, `%${month}%`), // include attendance for month
                    isNull(ATTENDANCE.date)              // or no attendance at all
                )
            )
        );

        // Normalize records to mark unmarked students as absent
        const safeRecords = result.map((r) => ({
            studentId: r.studentId,
            name: r.name,
            email: r.email,
            grade: r.grade,
            day: r.day ?? "N/A",
            date: r.date ?? "N/A",
            present: r.present ?? false,
        }));

        return NextResponse.json(safeRecords);
    } catch (error) {
        console.error("❌ Error fetching filtered attendance:", error);
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }
}
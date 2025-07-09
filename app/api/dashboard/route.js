import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get('date');
  const grade = searchParams.get('grade');

  if (!date || !grade || grade === 'undefined') {
    return NextResponse.json({ error: "Missing or invalid query parameters" }, { status: 400 });
  }

  const result = await db
    .select({
      day: ATTENDANCE.day,
      presentCount: sql`count(${ATTENDANCE.day})`.as("presentCount"),
    })
    .from(ATTENDANCE)
    .leftJoin(STUDENTS, eq(ATTENDANCE.studentId, STUDENTS.id))
    .where(and(eq(ATTENDANCE.date, date), eq(STUDENTS.grade, grade)))
    .groupBy(ATTENDANCE.day)
    .orderBy(desc(ATTENDANCE.day))
    .limit(7);

  return NextResponse.json(result);
}
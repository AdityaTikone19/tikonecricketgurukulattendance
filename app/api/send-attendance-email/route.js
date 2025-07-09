// app/api/send-attendance-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, status, date } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Tikone Cricket Gurukul" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Attendance Notification - ${date}`,
    html: `
      <p>Hi ${name},</p>
      <p>Your attendance for <strong>${date}</strong> has been marked as: <strong>${status}</strong>.</p>
      <p>If you believe this is incorrect, please contact your coach.</p>
      <br />
      <p>Regards,</p>
      <p>Tikone Cricket Gurukul</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error("Email send failed", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

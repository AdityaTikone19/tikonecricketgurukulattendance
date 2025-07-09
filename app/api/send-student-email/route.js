import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email } = await req.json();

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
    subject: "Welcome to Tikone Cricket Gurukul",
    html: `
  <p>Hello ${name},</p>
  <p>You have been successfully registered.</p>
  <p>Regards,</p>
  <p>Tikone Cricket Gurukul</p>
`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error("Email send failed", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
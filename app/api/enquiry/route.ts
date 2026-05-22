import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX = {
  name: 120,
  email: 254,
  company: 120,
  subject: 200,
  message: 4000,
} as const;

function trim(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t || t.length > max) return null;
  return t;
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const name = trim(body.name, MAX.name);
    const email = trim(body.email, MAX.email);
    const company = trim(body.company ?? "", MAX.company) ?? "";
    const subject = trim(body.subject, MAX.subject);
    const message = trim(body.message, MAX.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        user_id: null,
        name,
        email,
        company: company || null,
        subject,
        message,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Enquiry insert error:", error);
      return NextResponse.json(
        { error: "Could not save your enquiry. Check Supabase setup." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: "Message sent successfully. I'll get back to you soon.",
    });
  } catch (err) {
    console.error("Enquiry API error:", err);
    const message =
      err instanceof Error && err.message.includes("SUPABASE")
        ? "Enquiry service is not configured on the server."
        : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

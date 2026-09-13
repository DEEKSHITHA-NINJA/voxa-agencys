import { NextResponse } from "next/server";
import { appendFile, mkdir, access } from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

const leadsPath = path.join(process.cwd(), "data", "leads.ndjson");
const workbookPath = path.join(process.cwd(), "data", "voxa-leads.xlsx");

const smsMessage = "Thank you for booking a VOXA conversion call. We have received your request and our team will contact you shortly.";

async function sendConfirmationSms(mobile: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from || !mobile) return "not-configured";
  const to = mobile.replace(/\s|-/g, "").startsWith("+") ? mobile.replace(/\s|-/g, "") : `+91${mobile.replace(/\D/g, "")}`;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: smsMessage })
  });
  return response.ok ? "sent" : "failed";
}

async function addToExcel(lead: Record<string, string>) {
  let workbook: XLSX.WorkBook;
  try { await access(workbookPath); workbook = XLSX.readFile(workbookPath); }
  catch { workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Name", "Email", "Mobile Number", "City", "Message", "Submitted At"]]), "Leads"); }
  XLSX.utils.sheet_add_aoa(workbook.Sheets["Leads"], [[lead.name, lead.email, lead.mobile, lead.city, lead.message, lead.createdAt]], { origin: -1 });
  XLSX.writeFile(workbook, workbookPath);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, city, message, source } = body;
    if (!name || !email) return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    let smsStatus: string;
    try {
      smsStatus = await sendConfirmationSms(mobile || "");
    } catch (smsError) {
      console.error("SMS confirmation failed:", smsError);
      smsStatus = "failed";
    }
    const lead = { id: crypto.randomUUID(), name, email, mobile: mobile || "", city: city || "", message: message || "", smsStatus, source: source || "website", createdAt: new Date().toISOString() };
    await mkdir(path.dirname(leadsPath), { recursive: true });
    await appendFile(leadsPath, JSON.stringify(lead) + "\n", "utf8");
    try {
      await addToExcel(lead);
    } catch (excelError) {
      // The secure NDJSON lead database remains the source of truth if Excel is locked or unavailable.
      console.error("Excel lead export failed:", excelError);
    }
    return NextResponse.json({ ok: true, lead, smsStatus });
  } catch {
    return NextResponse.json({ error: "We couldn’t save your request. Please try again." }, { status: 500 });
  }
}

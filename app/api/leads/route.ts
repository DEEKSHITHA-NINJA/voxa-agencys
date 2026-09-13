import { NextResponse } from "next/server";

export const runtime = "nodejs";

const smsMessage =
  "Thank you for booking a VOXA conversion call. We have received your request and our team will contact you shortly.";

async function sendConfirmationSms(mobile: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from || !mobile) {
    console.error("Twilio environment variables are missing.");
    return "not-configured";
  }

  const cleanedMobile = mobile.replace(/\s|-/g, "");

  const to = cleanedMobile.startsWith("+")
    ? cleanedMobile
    : `+91${cleanedMobile.replace(/\D/g, "")}`;

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: smsMessage,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twilio error:", errorText);
    return "failed";
  }

  return "sent";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      mobile,
      city,
      message,
      source,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          error: "Name and email are required.",
        },
        { status: 400 }
      );
    }

    let smsStatus = "not-configured";

    if (mobile) {
      try {
        smsStatus = await sendConfirmationSms(mobile);
      } catch (error) {
        console.error("SMS confirmation failed:", error);
        smsStatus = "failed";
      }
    }

    const lead = {
      id: crypto.randomUUID(),
      name,
      email,
      mobile: mobile || "",
      city: city || "",
      message: message || "",
      smsStatus,
      source: source || "website",
      createdAt: new Date().toISOString(),
    };

    /*
      IMPORTANT:
      Do not write leads.ndjson or voxa-leads.xlsx here.
      Vercel serverless functions do not provide a permanent
      writable project filesystem.
    */

    console.log("New VOXA lead:", {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile,
      city: lead.city,
      smsStatus: lead.smsStatus,
      source: lead.source,
      createdAt: lead.createdAt,
    });

    return NextResponse.json({
      ok: true,
      message: "Lead submitted successfully.",
      smsStatus,
    });
  } catch (error) {
    console.error("Lead submission error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
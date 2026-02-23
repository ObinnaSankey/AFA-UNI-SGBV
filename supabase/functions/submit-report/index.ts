import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConfigMap {
  [key: string]: string;
}

function generateTrackingId(): string {
  const date = new Date();
  const dateStr =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `UNI-${dateStr}-${random}`;
}

function formatIncidentType(type: string): string {
  const map: Record<string, string> = {
    sexual_harassment: "Sexual Harassment",
    attempted_assault: "Attempted Assault",
    assault: "Assault",
    intimidation_retaliation: "Intimidation / Retaliation",
    other: "Other",
  };
  return map[type] || type;
}

function formatLocationType(type: string): string {
  const map: Record<string, string> = {
    on_campus: "On Campus",
    off_campus: "Off Campus",
    online: "Online / Digital",
    other: "Other",
  };
  return map[type] || type;
}

async function sendEmailViaResend(
  apiKey: string,
  from: string,
  to: string[],
  subject: string,
  html: string
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error: ${err}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const formData = await req.formData();

    const incidentType = formData.get("incidentType") as string;
    const locationType = formData.get("locationType") as string;
    const locationDetail = (formData.get("locationDetail") as string) || "";
    const incidentDate = (formData.get("incidentDate") as string) || "";
    const narrative = (formData.get("narrative") as string) || "";
    const peopleInvolved = (formData.get("peopleInvolved") as string) || "";
    const isAnonymous = formData.get("isAnonymous") === "true";
    const wantsFollowup = formData.get("wantsFollowup") === "true";
    const reporterName = (formData.get("reporterName") as string) || "";
    const reporterPhone = (formData.get("reporterPhone") as string) || "";
    const reporterEmail = (formData.get("reporterEmail") as string) || "";
    const consentGiven = formData.get("consentGiven") === "true";

    if (!incidentType || !locationType || !consentGiven) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: configRows } = await supabase
      .from("app_config")
      .select("key, value");

    const config: ConfigMap = {};
    (configRows || []).forEach((row: { key: string; value: string }) => {
      config[row.key] = row.value;
    });

    const trackingId = generateTrackingId();
    const institutionName = config.institution_name || "Your Institution";

    const routingEmails: string[] = [];
    if (config.routing_email_1) routingEmails.push(config.routing_email_1);
    if (config.routing_email_2) routingEmails.push(config.routing_email_2);

    const timestamp = new Date().toLocaleString("en-GB", {
      timeZone: "Africa/Lagos",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailBody = `
SGBV REPORTING PLATFORM — NEW REPORT
=====================================

Tracking ID:    ${trackingId}
Institution:    ${institutionName}
Submitted:      ${timestamp} (WAT)

INCIDENT DETAILS
----------------
Type:           ${formatIncidentType(incidentType)}
Location:       ${formatLocationType(locationType)}${locationDetail ? ` — ${locationDetail}` : ""}
Date (approx):  ${incidentDate || "Not specified"}

NARRATIVE
---------
${narrative || "(No narrative provided)"}

PEOPLE INVOLVED (if named)
--------------------------
${peopleInvolved || "(Not specified)"}

REPORTER INFORMATION
--------------------
Anonymous:      ${isAnonymous ? "Yes" : "No"}
Follow-up:      ${wantsFollowup ? "Yes" : "No"}
${!isAnonymous && reporterName ? `Name:           ${reporterName}` : ""}
${!isAnonymous && reporterEmail ? `Email:          ${reporterEmail}` : ""}
${!isAnonymous && reporterPhone ? `Phone:          ${reporterPhone}` : ""}

=====================================
Handle with strict confidentiality per institutional policy.
Tracking ID: ${trackingId}
=====================================
    `.trim();

    const emailSubject = `New SGBV Report – ${institutionName} – ${trackingId}`;

    const hasAttachment = formData.getAll("files").filter((f) => f instanceof File && (f as File).size > 0).length > 0;

    const storageMode = config.storage_mode || "minimal_metadata";
    if (storageMode !== "none") {
      const rowData: Record<string, unknown> = {
        tracking_id: trackingId,
        incident_type: incidentType,
        location_type: locationType,
        location_detail: locationDetail || null,
        incident_date_approx: incidentDate || null,
        wants_followup: wantsFollowup,
        consent_given: consentGiven,
        has_attachment: hasAttachment,
        status: "submitted",
      };

      if (storageMode === "full" && config.store_narrative === "true") {
        rowData.narrative_stored = narrative;
      }

      await supabase.from("reports").insert(rowData);
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (routingEmails.length > 0) {
      if (resendApiKey) {
        await sendEmailViaResend(
          resendApiKey,
          config.smtp_from || "noreply@uni-sgbv.org",
          routingEmails,
          emailSubject,
          `<pre style="font-family:monospace;font-size:14px;line-height:1.6;">${emailBody}</pre>`
        );
      } else {
        console.log("No email provider configured. Routing emails:", routingEmails.join(", "));
        console.log(`Report ${trackingId}: ${emailSubject}`);
      }
    }

    if (!isAnonymous && wantsFollowup && reporterEmail && resendApiKey) {
      const ackBody = `Dear ${reporterName || "Reporter"},

Your report has been received and is being handled confidentially.

Your Tracking ID: ${trackingId}

Please keep this Tracking ID safe. You can use it to follow up with the Gender Center
or designated authority at ${institutionName}.

This is an automated message. Do not reply to this email.

Uni SGBV Reporting Platform`;

      try {
        await sendEmailViaResend(
          resendApiKey,
          config.smtp_from || "noreply@uni-sgbv.org",
          [reporterEmail],
          `Your Report Has Been Received – Tracking ID: ${trackingId}`,
          `<pre style="font-family:monospace;font-size:14px;line-height:1.6;">${ackBody}</pre>`
        );
      } catch (ackErr) {
        console.error("Acknowledgement email failed:", ackErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, trackingId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-report error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

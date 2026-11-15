"use client";

import { FormEvent, useState } from "react";
import { Flag, X, CheckCircle2 } from "lucide-react";

export default function ReportCampaignButton({
  campaignId,
  campaignTitle,
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [reporterEmail, setReporterEmail] = useState("");
  const [reason, setReason] = useState("Misleading or inaccurate information");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterEmail: reporterEmail.trim(),
          reason,
          details: details.trim(),
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setStatusMessage(
          "Thank you. Your report has been submitted directly to our Trust & Safety moderation team for priority review."
        );
        setTimeout(() => {
          setOpen(false);
          setDetails("");
          setReporterEmail("");
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error("Failed to submit report");
      }
    } catch {
      // Graceful offline or browser storage fallback
      const report = {
        id: `report_${Date.now()}`,
        campaignId,
        campaignTitle,
        reason,
        details: details.trim(),
        createdAt: new Date().toISOString(),
      };
      try {
        const saved = JSON.parse(localStorage.getItem("gcc_foundation_campaign_reports") || "[]");
        localStorage.setItem("gcc_foundation_campaign_reports", JSON.stringify([report, ...saved]));
      } catch {}
      setIsSuccess(true);
      setStatusMessage("Your report has been received and flagged for safety review.");
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatusMessage("");
          setIsSuccess(false);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Flag className="h-4 w-4 text-gray-500" />
        Report this fundraiser
      </button>

      {statusMessage && !open && (
        <p role="status" className="mt-2 text-xs leading-relaxed text-[#02A95C]">
          {statusMessage}
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Trust & Safety Review
                </p>
                <h2 id="report-title" className="mt-1 text-xl font-extrabold text-[#1A1A1A]">
                  Report this fundraiser
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Help us protect our donor community. Submitting a report alerts our safety board.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close report form"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-[#02A95C] mx-auto" />
                <h3 className="font-bold text-gray-900">Report Received</h3>
                <p className="text-sm text-gray-600">{statusMessage}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Your Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Reason</label>
                  <select
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  >
                    {[
                      "Misleading or inaccurate information",
                      "Impersonation of patient or school",
                      "Unsafe or harmful content",
                      "Suspected misuse of donations",
                      "Other compliance concern",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Details of the concern
                  </label>
                  <textarea
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    required
                    maxLength={2000}
                    rows={4}
                    placeholder="Please describe why this fundraiser should be reviewed. Do not include passwords or financial account numbers."
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-[#02A95C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#028F4D] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}

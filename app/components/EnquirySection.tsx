"use client";

import { FormEvent, useCallback, useState } from "react";
import { FiSend } from "react-icons/fi";
import "./EnquirySection.css";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export default function EnquirySection() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Submission failed.");
      }

      setStatus({ type: "ok", text: data.message ?? "Message sent." });
      setForm(emptyForm);
    } catch (err: unknown) {
      setStatus({
        type: "err",
        text: err instanceof Error ? err.message : "Could not send your message.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateField = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
      },
    [],
  );

  return (
    <div className="enquiry-wrap">
      <div className="enquiry-header">
        <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-white/30 uppercase mb-2">
          Official enquiry
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Work with me
        </h3>
        <p className="text-white/45 text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Send a message for collaborations, freelance work, or hiring — no account
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="enquiry-panel enquiry-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="enquiry-label">
            Name <span className="text-white/30">*</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={updateField("name")}
              className="enquiry-input"
              placeholder="Your name"
            />
          </label>
          <label className="enquiry-label">
            Email <span className="text-white/30">*</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={updateField("email")}
              className="enquiry-input"
              placeholder="you@email.com"
            />
          </label>
        </div>

        <label className="enquiry-label">
          Company / Organization
          <input
            type="text"
            value={form.company}
            onChange={updateField("company")}
            className="enquiry-input"
            placeholder="Optional"
          />
        </label>

        <label className="enquiry-label">
          Subject <span className="text-white/30">*</span>
          <input
            type="text"
            required
            value={form.subject}
            onChange={updateField("subject")}
            className="enquiry-input"
            placeholder="Project, role, or collaboration"
          />
        </label>

        <label className="enquiry-label">
          Message <span className="text-white/30">*</span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={updateField("message")}
            className="enquiry-input enquiry-textarea"
            placeholder="Tell me about your idea, timeline, and goals…"
          />
        </label>

        <button
          type="submit"
          disabled={submitLoading}
          className="enquiry-btn enquiry-btn--primary w-full sm:w-auto"
        >
          <FiSend aria-hidden />
          {submitLoading ? "Sending…" : "Send message"}
        </button>
      </form>

      {status && (
        <p
          role="status"
          className={`enquiry-status ${status.type === "ok" ? "enquiry-status--ok" : "enquiry-status--err"}`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}

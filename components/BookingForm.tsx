"use client";

import { useState } from "react";

interface BookingFormProps {
  eventId?: string;
  slug?: string;
  eventTitle: string;
}

export default function BookingForm({ eventId, slug, eventTitle }: BookingFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatusMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, slug, email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || "Spot booked successfully! Check your email for confirmation.",
        });
        setEmail("");
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to book event. Please try again.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Something went wrong. Please check your internet connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book-event" className="signup-card">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-white">Book Your Spot</h2>
        <p className="text-sm text-light-200">
          Reserve your seat for <span className="font-semibold text-primary">{eventTitle}</span>.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-md text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-950/70 border border-emerald-500 text-emerald-300"
              : "bg-rose-950/70 border border-rose-500 text-rose-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-light-100">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Booking Spot..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}

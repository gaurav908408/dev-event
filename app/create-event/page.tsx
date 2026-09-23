"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    image: "/images/event1.svg",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "hybrid",
    audience: "",
    agenda: "",
    organizer: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Event created successfully! Redirecting to home...",
        });
        setTimeout(() => {
          router.push("/#events");
        }, 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to create event. Please check inputs.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "An error occurred while creating the event.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="create-event" className="mx-auto container max-w-4xl px-6 sm:px-10 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-light-200 hover:text-primary mb-8 transition-colors"
      >
        ← Back to Home
      </Link>

      <div className="bg-dark-100/70 border border-border-dark p-6 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Dev Event</h1>
        <p className="text-light-200 text-sm mb-8">
          Fill in the details below to host your hackathon, conference, or tech meetup.
        </p>

        {statusMessage && (
          <div
            className={`p-4 rounded-lg text-sm mb-6 ${
              statusMessage.type === "success"
                ? "bg-emerald-950/70 border border-emerald-500 text-emerald-300"
                : "bg-rose-950/70 border border-rose-500 text-rose-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Event Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Next.js & AI Hackathon"
                value={formData.title}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Organizer Name *</label>
              <input
                type="text"
                name="organizer"
                placeholder="e.g. Dev Community Team"
                value={formData.organizer}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-light-100">Short Description *</label>
            <input
              type="text"
              name="description"
              placeholder="A brief summary of what the event is about"
              value={formData.description}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-light-100">Full Overview *</label>
            <textarea
              name="overview"
              rows={4}
              placeholder="Detailed description, goals, and what attendees will learn"
              value={formData.overview}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none [color-scheme:dark]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Time *</label>
              <input
                type="text"
                name="time"
                placeholder="e.g. 10:00 AM - 5:00 PM EST"
                value={formData.time}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Event Mode *</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
              >
                <option value="hybrid">Hybrid</option>
                <option value="online">Online</option>
                <option value="offline">In-Person (Offline)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Location (City/Online) *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. San Francisco, CA & Online"
                value={formData.location}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Venue Name *</label>
              <input
                type="text"
                name="venue"
                placeholder="e.g. Moscone Center / Zoom"
                value={formData.venue}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Target Audience *</label>
              <input
                type="text"
                name="audience"
                placeholder="e.g. Software Engineers, Students"
                value={formData.audience}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Poster Image Path/URL *</label>
              <input
                type="text"
                name="image"
                placeholder="/images/event1.svg"
                value={formData.image}
                onChange={handleChange}
                className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-light-100">Event Agenda (One item per line) *</label>
            <textarea
              name="agenda"
              rows={4}
              placeholder="09:00 AM - Welcome&#10;10:00 AM - Keynote Session&#10;01:00 PM - Workshop"
              value={formData.agenda}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-light-100">Tags (Comma-separated) *</label>
            <input
              type="text"
              name="tags"
              placeholder="NextJS, AI, React, Hackathon"
              value={formData.tags}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#59deca] via-[#38bdf8] to-[#6366f1] hover:brightness-110 hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-slate-950 font-bold text-lg py-3.5 px-6 rounded-xl transition-all duration-300 ease-out cursor-pointer mt-4"
          >
            {isSubmitting ? "Publishing Event..." : "Publish Event"}
          </button>
        </form>
      </div>
    </main>
  );
}

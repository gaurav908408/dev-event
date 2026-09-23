"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditEventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${slug}`);
        const data = await response.json();

        if (response.ok && data.success && data.data) {
          const event = data.data;

          // Format date string to YYYY-MM-DD for <input type="date"> if valid date
          let formattedDate = event.date || "";
          if (formattedDate && !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const parsed = new Date(formattedDate);
            if (!isNaN(parsed.getTime())) {
              formattedDate = parsed.toISOString().split("T")[0];
            }
          }

          setFormData({
            title: event.title || "",
            description: event.description || "",
            overview: event.overview || "",
            image: event.image || "/images/event1.svg",
            venue: event.venue || "",
            location: event.location || "",
            date: formattedDate,
            time: event.time || "",
            mode: event.mode ? event.mode.toLowerCase() : "hybrid",
            audience: event.audience || "",
            agenda: Array.isArray(event.agenda) ? event.agenda.join("\n") : event.agenda || "",
            organizer: event.organizer || "",
            tags: Array.isArray(event.tags) ? event.tags.join(", ") : event.tags || "",
          });
        } else {
          setStatusMessage({
            type: "error",
            text: data.error || "Event not found.",
          });
        }
      } catch (err) {
        setStatusMessage({
          type: "error",
          text: "Failed to load event details for editing.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [slug]);

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
      const response = await fetch(`/api/events/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Event updated successfully! Redirecting...",
        });
        setTimeout(() => {
          router.push(`/events/${slug}`);
          router.refresh();
        }, 1200);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update event. Please check inputs.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "An error occurred while updating the event.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto container max-w-4xl px-6 py-20 text-center text-light-200">
        <p className="text-lg">Loading event details for editing...</p>
      </main>
    );
  }

  return (
    <main id="edit-event" className="mx-auto container max-w-4xl px-6 sm:px-10 py-10">
      <Link
        href={`/events/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-light-200 hover:text-primary mb-8 transition-colors"
      >
        ← Back to Event Details
      </Link>

      <div className="bg-dark-100/70 border border-border-dark p-6 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Dev Event</h1>
        <p className="text-light-200 text-sm mb-8">
          Update the event information below.
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
              value={formData.overview}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-100">Date (Pick from calendar) *</label>
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
              value={formData.tags}
              onChange={handleChange}
              className="bg-dark-200 text-white rounded-lg px-4 py-2.5 border border-border-dark focus:border-primary outline-none"
              required
            />
          </div>

          <div className="flex flex-row gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#59deca] via-[#38bdf8] to-[#6366f1] hover:brightness-110 hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-slate-950 font-bold text-lg py-3.5 px-6 rounded-xl transition-all duration-300 ease-out cursor-pointer"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
            <Link
              href={`/events/${slug}`}
              className="bg-dark-200/80 hover:bg-dark-100 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_20px_rgba(89,222,202,0.3)] text-white font-medium py-3.5 px-6 rounded-xl border border-border-dark text-center transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EventActionsProps {
  slug: string;
  eventTitle: string;
}

export default function EventActions({ slug, eventTitle }: EventActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`/api/events/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/#events");
        router.refresh();
      } else {
        setErrorMsg(data.error || "Failed to delete event.");
        setIsDeleting(false);
        setShowConfirm(false);
      }
    } catch (error) {
      setErrorMsg("An error occurred while deleting the event.");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-3">
        <Link
          href={`/events/${slug}/edit`}
          className="inline-flex items-center gap-2 bg-dark-200 hover:bg-dark-100 text-white font-medium px-4 py-2 rounded-lg border border-border-dark text-sm transition-colors cursor-pointer"
        >
          ✏️ Edit Event
        </Link>

        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-medium px-4 py-2 rounded-lg border border-rose-800/50 text-sm transition-colors cursor-pointer"
        >
          🗑️ Delete Event
        </button>
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 mt-1">{errorMsg}</p>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-dark-100 border border-border-dark rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">Delete Event?</h3>
            <p className="text-sm text-light-200">
              Are you sure you want to delete <span className="text-white font-semibold">"{eventTitle}"</span>? This action cannot be undone.
            </p>

            <div className="flex flex-row justify-end gap-3 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm text-light-100 hover:text-white bg-dark-200 border border-border-dark cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm text-white bg-rose-600 hover:bg-rose-500 font-medium cursor-pointer transition-colors"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

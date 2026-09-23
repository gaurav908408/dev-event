import type { Document, Model } from "mongoose";

/**
 * Interface representing an Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Converts text into a URL-friendly slug string.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-")  // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, "");  // Strip leading and trailing hyphens
}

let EventModel: Model<IEvent> | any = null;

try {
  // Dynamically load Mongoose to prevent build-time breakage if package is loading
  const mongoose = require("mongoose");
  const { Schema, model, models } = mongoose;

  const EventSchema = new Schema(
    {
      title: {
        type: String,
        required: [true, "Event title is required."],
        trim: true,
      },
      slug: {
        type: String,
        required: [true, "Event slug is required."],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      description: {
        type: String,
        required: [true, "Event description is required."],
        trim: true,
      },
      overview: {
        type: String,
        required: [true, "Event overview is required."],
        trim: true,
      },
      image: {
        type: String,
        required: [true, "Event image is required."],
        trim: true,
      },
      venue: {
        type: String,
        required: [true, "Event venue is required."],
        trim: true,
      },
      location: {
        type: String,
        required: [true, "Event location is required."],
        trim: true,
      },
      date: {
        type: String,
        required: [true, "Event date is required."],
        trim: true,
      },
      time: {
        type: String,
        required: [true, "Event time is required."],
        trim: true,
      },
      mode: {
        type: String,
        required: [true, "Event mode is required."],
        trim: true,
      },
      audience: {
        type: String,
        required: [true, "Event audience is required."],
        trim: true,
      },
      agenda: {
        type: [String],
        required: [true, "Event agenda is required."],
      },
      organizer: {
        type: String,
        required: [true, "Event organizer is required."],
        trim: true,
      },
      tags: {
        type: [String],
        required: [true, "Event tags are required."],
      },
    },
    {
      timestamps: true,
    }
  );

  EventSchema.index({ slug: 1 }, { unique: true });

  /**
   * Pre-save hook for slug, date, and time processing.
   */
  EventSchema.pre("save", function (this: any, next: any) {
    if (this.isModified("title") || !this.slug) {
      this.slug = slugify(this.title);
    }

    if (this.isModified("date")) {
      const parsedDate = new Date(this.date);
      if (!isNaN(parsedDate.getTime())) {
        this.date = parsedDate.toISOString().split("T")[0];
      }
    }

    if (this.isModified("time")) {
      this.time = this.time.trim();
    }

    next();
  });

  EventModel = models.Event || model("Event", EventSchema);
} catch (e) {
  // Fallback when mongoose is initializing
}

export default EventModel;

import type { Document, Model } from "mongoose";

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let EventModel: Model<IEvent> | any = null;

try {
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
} catch (e) {}

export default EventModel;

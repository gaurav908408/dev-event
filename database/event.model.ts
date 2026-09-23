import { Schema, model, models, Document, Model } from "mongoose";

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

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event title cannot be empty.",
      },
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
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event description cannot be empty.",
      },
    },
    overview: {
      type: String,
      required: [true, "Event overview is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event overview cannot be empty.",
      },
    },
    image: {
      type: String,
      required: [true, "Event image is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event image path cannot be empty.",
      },
    },
    venue: {
      type: String,
      required: [true, "Event venue is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event venue cannot be empty.",
      },
    },
    location: {
      type: String,
      required: [true, "Event location is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event location cannot be empty.",
      },
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
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event mode cannot be empty.",
      },
    },
    audience: {
      type: String,
      required: [true, "Event audience is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event audience cannot be empty.",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Event agenda is required."],
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0 && arr.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty string.",
      },
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required."],
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Event organizer cannot be empty.",
      },
    },
    tags: {
      type: [String],
      required: [true, "Event tags are required."],
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0 && arr.every((tag) => tag.trim().length > 0),
        message: "Tags must contain at least one non-empty string.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique index constraint on slug
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook:
 * - Regenerates slug only if title is modified or slug does not exist.
 * - Validates and normalizes `date` to ISO string format (YYYY-MM-DD).
 * - Trims and normalizes `time` string format.
 */
EventSchema.pre<IEvent>("save", function (next) {
  // Regenerate slug if title changed or slug is not set
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  // Validate and normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      return next(new Error(`Invalid date format for event: "${this.date}". Must be a valid date.`));
    }
    this.date = parsedDate.toISOString().split("T")[0];
  }

  // Normalize time string
  if (this.isModified("time")) {
    const trimmedTime = this.time.trim();
    if (!trimmedTime) {
      return next(new Error("Event time cannot be empty."));
    }
    this.time = trimmedTime;
  }

  next();
});

const Event: Model<IEvent> = models.Event || model<IEvent>("Event", EventSchema);

export default Event;

import { Schema, model, models, Document, Model, Types } from "mongoose";

/**
 * Interface representing a Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// RFC 5322 compliant standard email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required for booking."],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => EMAIL_REGEX.test(email),
        message: "Please enter a valid email address.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index on eventId for high-performance booking queries by event
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook:
 * Verifies that the referenced `eventId` exists in the database
 * before allowing the booking record to be saved.
 */
BookingSchema.pre<IBooking>("save", async function (next) {
  if (this.isModified("eventId")) {
    // Obtain active Event model to query existing events
    const EventModel = models.Event || model("Event");
    const existingEvent = await EventModel.findById(this.eventId);

    if (!existingEvent) {
      return next(new Error(`Booking failed: Referenced event with ID "${this.eventId}" does not exist.`));
    }
  }

  next();
});

const Booking: Model<IBooking> = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;

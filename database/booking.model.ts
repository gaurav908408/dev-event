import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const BookingSchema = new Schema(
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

BookingSchema.index({ eventId: 1 });

BookingSchema.pre("save", async function (this: any, next: any) {
  if (this.isModified("eventId")) {
    const EventModel = models.Event || model("Event");
    const existingEvent = await EventModel.findById(this.eventId);

    if (!existingEvent) {
      return next(new Error(`Booking failed: Referenced event with ID "${this.eventId}" does not exist.`));
    }
  }

  next();
});

const BookingModel: Model<IBooking> = models.Booking || model<IBooking>("Booking", BookingSchema);

export default BookingModel;

import { Schema, Types, Document, models, model } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook: Verify that the referenced event exists
 * Throws an error if the event does not exist, ensuring referential integrity
 */
bookingSchema.pre('save', async function () {
  // Only validate if eventId is being set or modified
  if (this.isModified('eventId') || this.isNew) {
    try {
      const event = await Event.findById(this.eventId).select('_id');
      if (!event) {
        throw new Error(`Event with ID ${this.eventId} does not exist`);
      }
    } catch (err) {
      // If it's already our custom error, re-throw it
      if (err instanceof Error && err.message.includes('does not exist')) {
        throw err;
      }
      // Otherwise, wrap database errors in a consistent error message
      throw new Error('Failed to validate event reference');
    }
  }
});

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

/**
 * Booking model
 */
const Booking = models.Booking || model<IBooking>('Booking', bookingSchema);

export default Booking;
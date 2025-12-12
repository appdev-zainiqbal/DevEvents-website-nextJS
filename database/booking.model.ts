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
      index: true, // Index for faster queries on eventId
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
bookingSchema.pre('save', async function (next) {
  const callback = next as (err?: Error) => void;
  
  // Only validate if eventId is being set or modified
  if (this.isModified('eventId') || this.isNew) {
    try {
      const event = await Event.findById(this.eventId).select('_id');
      if (!event) {
        return callback(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (err) {
      return callback(new Error('Failed to validate event reference'));
    }
  }

  return callback();
});

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

/**
 * Booking model
 */
const Booking = models.Booking || model<IBooking>('Booking', bookingSchema);

export default Booking;
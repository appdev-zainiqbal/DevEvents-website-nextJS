import mongoose, { Schema, Document, model,models  } from 'mongoose';

/**
 * TypeScript interface for Event document properties
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

// /**
//  * Mongoose Document interface combining IEvent with Document methods
//  */
// export interface IEventDocument extends IEvent, Document {
//   _id: mongoose.Types.ObjectId;
// }

// /**
//  * Event schema definition with all required fields
//  */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Event title must be less than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Event slug is required'],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Event description must be less than 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      maxlength: [500, 'Event overview must be less than 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
      validate: {
        validator: (v: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(v.trim());
        },
        message: 'Date must be in YYYY-MM-DD format',
      },
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      trim: true,
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be one of: online, offline, hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (v: string[]) =>  v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must be a non-empty array',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize date to ISO format (YYYY-MM-DD)
 * Trims the date string - schema validation will enforce format requirements
 */
function normalizeDate(date: string): string {
  return date.trim();
}

/**
 * Normalize time to consistent format (HH:MM or HH:MM:SS)
 * Ensures time is stored in a standard format
 */
function normalizeTime(time: string): string {
  const trimmed = time.trim();
  // If time matches HH:MM or HH:MM:SS format, return as is
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(trimmed)) {
    return trimmed;
  }
  // Otherwise, try to parse and format
  try {
    const date = new Date(`2000-01-01T${trimmed}`);
    if (!isNaN(date.getTime())) {
      return date.toTimeString().slice(0, 5); // Returns HH:MM
    }
  } catch {
    // If parsing fails, return original (validation will catch if invalid)
  }
  return trimmed;
}

/**
 * Pre-save hook: Generate slug, normalize date and time
 * Only regenerates slug if title has changed
 */
eventSchema.pre('save', function (next) {
 
  const callback = next as (err?: Error) => void;

  // Generate slug only if title changed or slug doesn't exist
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format
  if (this.isModified('date')) {
    this.date = normalizeDate(this.date);
  }

  // Normalize time to consistent format
  if (this.isModified('time')) {
    this.time = normalizeTime(this.time);
  }

//   // Validate required fields are non-empty
//   const requiredFields: (keyof IEvent)[] = [
//     'title',
//     'description',
//     'overview',
//     'image',
//     'venue',
//     'location',
//     'date',
//     'time',
//     'mode',
//     'audience',
//     'organizer',
//   ];

//   for (const field of requiredFields) {
//     const value = doc[field];
//     if (!value || (typeof value === 'string' && value.trim() === '')) {
//       return callback(new Error(`${field} is required and cannot be empty`));
//     }
//   }

//   // Validate arrays are non-empty
//   if (!doc.agenda || doc.agenda.length === 0) {
//     return callback(new Error('Agenda must contain at least one item'));
//   }

//   if (!doc.tags || doc.tags.length === 0) {
//     return callback(new Error('Tags must contain at least one item'));
//   }

  return callback();
});

// Create unique index on slug for faster lookups
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 */
const Event = models.Event || model<IEvent>('Event', eventSchema);

export default Event;
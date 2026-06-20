import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
  },
  { timestamps: true }
);

BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');
      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        throw error;
      }
    } catch {
      const validationError = new Error('Invalid event ID format or database error');
      validationError.name = 'ValidationError';
      throw validationError;
    }
  }
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true, name: 'uniq_event_user' });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);
export default Booking;
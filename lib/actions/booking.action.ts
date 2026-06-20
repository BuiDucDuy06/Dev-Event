'use server'
import Booking from "@/database/booking.model";
import connectDB from "../mongodb";

export const createBooking = async ({
  eventId,
  userId,
  userName,
  userEmail,
}: {
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
}) => {
  try {
    await connectDB();
    await Booking.create({ eventId, userId, userName, userEmail });
    return { success: true };
  } catch (e: any) {
    if (e?.code === 11000) {
      return { success: false, alreadyBooked: true };
    }
    console.error('create booking failed', e);
    return { success: false, alreadyBooked: false };
  }
};

export const checkBooking = async ({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) => {
  try {
    await connectDB();
    const booking = await Booking.findOne({ eventId, userId });
    return { booked: !!booking };
  } catch (e) {
    return { booked: false };
  }
};
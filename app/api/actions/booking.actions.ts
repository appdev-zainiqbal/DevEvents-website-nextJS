"use server";
import { Booking } from "@/database";
import connectDB from "@/lib/mongodb";

export const CreateBooking = async ({eventId , email , slug}: {eventId: string, email: string, slug: string}) => {
  try {
    await connectDB();
    await Booking.create({ eventId, email, slug });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to create booking", error);
    return {
      success: false,
    };
  }
};
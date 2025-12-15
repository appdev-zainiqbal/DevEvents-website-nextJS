import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, IEvent } from "@/database";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const rawEvent = Object.fromEntries(formData.entries());

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    let tags =JSON.parse(formData.get("tags") as string) ;
    let agenda =JSON.parse(formData.get("agenda") as string) ;


    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary using upload_stream
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "events",
            transformation: [
              {
                width: 1200,
                height: 800,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({ secure_url: result.secure_url });
            } else {
              reject(new Error("Upload failed: No result returned"));
            }
          }
        );

        uploadStream.end(buffer);
      }
    );

    

    // Create event object with proper types
    const eventData: Partial<IEvent> = {
      title: String(rawEvent.title),
      description: String(rawEvent.description),
      overview: String(rawEvent.overview),
      image: uploadResult.secure_url,
      venue: String(rawEvent.venue),
      location: String(rawEvent.location),
      date: String(rawEvent.date),
      time: String(rawEvent.time),
      mode: String(rawEvent.mode),
      audience: String(rawEvent.audience),
      agenda: agenda,
      organizer: String(rawEvent.organizer),
      tags: tags, 
    };

    // Create the event
    const createdEvent = await Event.create(eventData);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create event",
      },
      { status: 500 }
    );
  }


}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    // Serialize Mongoose documents to plain objects for JSON response
    const serializedEvents = JSON.parse(JSON.stringify(events));
    return NextResponse.json({ message: 'Events fetched successfully', events: serializedEvents }, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch events' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete event' }, { status: 500 });
  }
}
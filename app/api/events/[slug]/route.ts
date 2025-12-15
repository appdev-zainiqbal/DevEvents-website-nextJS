import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, IEvent } from "@/database";

/**
 * Validates if a slug is in the correct format
 * Slugs should be lowercase, alphanumeric with hyphens, and non-empty
 */
function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return false;
  }
  // Slug should be lowercase, alphanumeric with hyphens, no spaces or special chars
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug.trim().toLowerCase());
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 *
 * @param req - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // Extract and validate slug from route parameters
    const { slug } = await params;

    // Validate slug format
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          error: "Invalid slug format. Slug must be a non-empty string containing only lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug (case-insensitive for safety)
    const event = await Event.findOne({ slug: slug.toLowerCase().trim() }).lean();

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json(
        {
          error: `Event with slug "${slug}" not found.`,
        },
        { status: 404 }
      );
    }

    // Serialize Mongoose document to plain object for JSON response
    const serializedEvent: IEvent = JSON.parse(JSON.stringify(event));

    // Return successful response with event data
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event: serializedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching event by slug:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to fetch event: ${error.message}`
            : "An unexpected error occurred while fetching the event.",
      },
      { status: 500 }
    );
  }
}


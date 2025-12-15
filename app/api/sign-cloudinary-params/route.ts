import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary - validation happens at runtime in the handler
function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing required Cloudinary environment variables");
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  };
}

export async function POST(request: Request) {
  try {
    // Validate and configure Cloudinary at runtime, not at build time
    const config = getCloudinaryConfig();
    cloudinary.config(config);

    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      config.api_secret
    );

    return Response.json({ signature });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign Cloudinary parameters",
      },
      { status: 500 }
    );
  }
}


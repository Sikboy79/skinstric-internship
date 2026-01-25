import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let image = body.Image || body.image;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { success: false, message: "Image is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `External API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Phase Two API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
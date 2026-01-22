import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, location } = await req.json();

    if (!name || !location) {
      console.warn("Missing name or location:", { name, location });
      return NextResponse.json(
        { error: "Name and location are required" },
        { status: 400 },
      );
    }

    const externalUrl =
      "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";

    const response = await fetch(externalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(" External API error:", text);
      return NextResponse.json(
        { error: "External API failed", details: text },
        { status: 502 },
      );
    }

    // Try parsing JSON; fallback to text if no JSON
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("/api/skinstric Server Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}


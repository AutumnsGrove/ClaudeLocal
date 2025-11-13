import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/settings - Fetch app settings
export async function GET() {
  try {
    let settings = await prisma.appSettings.findUnique({
      where: { id: 1 },
    });

    // If no settings exist, create defaults
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: 1 }, // Use all default values from schema
      });
    }

    return Response.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// PUT /api/settings - Update app settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Remove id, createdAt, updatedAt from update data (they shouldn't be updated)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...updateData } = body;

    const settings = await prisma.appSettings.upsert({
      where: { id: 1 },
      update: updateData,
      create: { id: 1, ...updateData },
    });

    return Response.json(settings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}

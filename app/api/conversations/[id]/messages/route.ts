import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET messages for a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// DELETE messages for a specific conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: "messageIds array is required" },
        { status: 400 },
      );
    }

    // Delete messages
    const result = await prisma.message.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
        conversationId: id,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error: any) {
    console.error("Error deleting messages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete messages" },
      { status: 500 },
    );
  }
}

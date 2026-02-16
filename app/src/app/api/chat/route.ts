import { NextRequest, NextResponse } from "next/server";
import { getCharacter } from "@/data/characters";
import { generateResponse } from "@/lib/chat-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterId, message, messageCount, isPremiumUser } = body;

    if (!characterId || !message) {
      return NextResponse.json(
        { error: "characterId and message are required" },
        { status: 400 }
      );
    }

    const character = getCharacter(characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const result = generateResponse(message, character, {
      messages: [],
      messageCount: messageCount || 0,
      isPremiumUser: isPremiumUser || false,
    });

    return NextResponse.json({
      response: result.response,
      shouldShowPaywall: result.shouldShowPaywall,
      premiumTease: result.premiumTease,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

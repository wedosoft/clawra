"use client";

export interface StoredChat {
  characterId: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
}

export interface UserData {
  isPremium: boolean;
  premiumExpiry: number | null;
  totalMessages: number;
  chats: Record<string, StoredChat>;
  favoriteCharacter: string | null;
}

const STORAGE_KEY = "mochi_user_data";

function getDefaultData(): UserData {
  return {
    isPremium: false,
    premiumExpiry: null,
    totalMessages: 0,
    chats: {},
    favoriteCharacter: null,
  };
}

export function getUserData(): UserData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw);
  } catch {
    return getDefaultData();
  }
}

export function saveUserData(data: UserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getChatMessages(characterId: string) {
  const data = getUserData();
  return data.chats[characterId]?.messages || [];
}

export function saveChatMessage(
  characterId: string,
  message: { id: string; role: "user" | "assistant"; content: string; timestamp: number }
) {
  const data = getUserData();
  if (!data.chats[characterId]) {
    data.chats[characterId] = { characterId, messages: [] };
  }
  data.chats[characterId].messages.push(message);
  data.totalMessages += 1;
  saveUserData(data);
}

export function getMessageCount(characterId: string): number {
  const data = getUserData();
  return data.chats[characterId]?.messages.filter(m => m.role === "user").length || 0;
}

export function setPremium(isPremium: boolean): void {
  const data = getUserData();
  data.isPremium = isPremium;
  data.premiumExpiry = isPremium ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null;
  saveUserData(data);
}

export function isPremiumUser(): boolean {
  const data = getUserData();
  if (!data.isPremium) return false;
  if (data.premiumExpiry && data.premiumExpiry < Date.now()) {
    data.isPremium = false;
    data.premiumExpiry = null;
    saveUserData(data);
    return false;
  }
  return true;
}

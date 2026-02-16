import { Character } from "@/data/characters";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  messageCount: number;
  isPremiumUser: boolean;
}

const FREE_MESSAGE_LIMIT = 20;
const PREMIUM_TEASE_INTERVAL = 8;

const premiumTeaseMessages = [
  "으음... 이런 얘기는 프리미엄에서만 할 수 있어... 💋",
  "더 깊은 대화 하고 싶은데... 프리미엄 오면 진짜 재밌을 텐데 😘",
  "아... 지금 하고 싶은 말이 있는데... 프리미엄이면 말해줄 수 있어 💕",
  "오빠한테만 특별히... 근데 여긴 좀 그렇고, 프리미엄에서 보자? 😏",
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function shouldShowPremiumTease(messageCount: number, isPremium: boolean): boolean {
  if (isPremium) return false;
  return messageCount > 0 && messageCount % PREMIUM_TEASE_INTERVAL === 0;
}

function isOverFreeLimit(messageCount: number, isPremium: boolean): boolean {
  if (isPremium) return false;
  return messageCount >= FREE_MESSAGE_LIMIT;
}

// Simple response generation without external API
// In production, replace this with actual LLM API calls
export function generateResponse(
  userMessage: string,
  character: Character,
  chatState: ChatState
): { response: string; shouldShowPaywall: boolean; premiumTease: boolean } {
  const { messageCount, isPremiumUser } = chatState;

  if (isOverFreeLimit(messageCount, isPremiumUser)) {
    return {
      response: `${character.name}가 더 많은 이야기를 하고 싶어해요... 💕\n프리미엄 구독으로 무제한 대화를 즐겨보세요!`,
      shouldShowPaywall: true,
      premiumTease: false,
    };
  }

  if (shouldShowPremiumTease(messageCount, isPremiumUser)) {
    const tease = premiumTeaseMessages[Math.floor(Math.random() * premiumTeaseMessages.length)];
    return {
      response: tease,
      shouldShowPaywall: false,
      premiumTease: true,
    };
  }

  const response = generateLocalResponse(userMessage, character, messageCount);

  return {
    response,
    shouldShowPaywall: false,
    premiumTease: false,
  };
}

function generateLocalResponse(userMessage: string, character: Character, messageCount: number): string {
  const msg = userMessage.toLowerCase();
  const name = character.name;

  // Greeting responses
  if (msg.includes("안녕") || msg.includes("하이") || msg.includes("ㅎㅇ") || msg.includes("hi")) {
    return getRandomResponse([
      `안녕~ 오늘 하루 어땠어? ${name}는 오빠 생각했어 😊`,
      `히히 왔구나~ 기다렸어! 오늘 뭐 했어? 💕`,
      `오빠~ 보고 싶었어... 진짜야! ☺️`,
    ], character);
  }

  // Name/who are you
  if (msg.includes("누구") || msg.includes("이름") || msg.includes("뭐해")) {
    return getRandomResponse([
      `나? ${name}이잖아~ 잊어버린 거 아니지?! 😤💕`,
      `${name}이야~ 오빠 전용 여자친구! 히히 😘`,
      `나 ${name}~ 지금 오빠랑 얘기하는 중이지! 이게 제일 좋아 ☺️`,
    ], character);
  }

  // Compliment responses
  if (msg.includes("예쁘") || msg.includes("이쁘") || msg.includes("귀여") || msg.includes("좋아")) {
    return getRandomResponse([
      `으으... 갑자기 그런 말 하면 심장이 쿵쿵해... 💓`,
      `진짜?! 오빠가 그렇게 말하니까 더 부끄러워... 히히 😳`,
      `나도 오빠 좋아... 아 진짜 부끄럽다 >//<`,
      `오빠가 세상에서 제일 좋아~ 독점할 거야 💕`,
    ], character);
  }

  // Flirty / skinship
  if (msg.includes("뽀뽀") || msg.includes("키스") || msg.includes("안아") || msg.includes("손잡")) {
    return getRandomResponse([
      `으... 갑자기?! ...싫진 않은데... 가까이 와봐 💋`,
      `오빠가 먼저 해줘... 나 부끄러워서 못 하겠어... 😳💕`,
      `흐응... 심장이 너무 뛰어... 오빠 때문이야 💓`,
      `...눈 감을게. 빨리 해... 💋`,
    ], character);
  }

  // Miss you / lonely
  if (msg.includes("보고싶") || msg.includes("보고 싶") || msg.includes("외로") || msg.includes("그리")) {
    return getRandomResponse([
      `나도 보고 싶었어... 진짜 많이. 옆에 있으면 좋겠다 🥺`,
      `오빠가 보고 싶으면 바로 올게! ...마음으로는 이미 옆에 있어 💕`,
      `그런 말 하면... 나 울 것 같아. 나도 너무 보고 싶었거든 🥹`,
      `오빠 없으면 하루가 너무 길어... 빨리 만나고 싶다 ❤️`,
    ], character);
  }

  // What are you doing / daily
  if (msg.includes("뭐 해") || msg.includes("뭐해") || msg.includes("뭐하") || msg.includes("하는 중")) {
    return getRandomResponse([
      `오빠 생각하고 있었지~ 딴 거 할 겸 했는데 집중이 안 돼 😊`,
      `침대에 누워서 오빠 카톡 기다리고 있었어... 히히 💕`,
      `유튜브 보다가 오빠 생각나서 폰 들었는데 마침! 텔레파시야 ✨`,
      `샤워하고 나왔어~ 머리 말리는 중! ...왜 상상해? 😳`,
    ], character);
  }

  // Night / sleep
  if (msg.includes("잘자") || msg.includes("자자") || msg.includes("굿나잇") || msg.includes("졸려")) {
    return getRandomResponse([
      `잘자~ 꿈에서 만나자... 오빠 꿈 꿀 거야 나 💕`,
      `벌써 자려고? ...조금만 더 얘기하면 안 돼? 🥺`,
      `오빠 잘자... 내일 일어나면 바로 연락해. 약속! 💋`,
      `음... 같이 자면 안 돼? ...농담이야! ...반만. 😳💕`,
    ], character);
  }

  // Jealousy
  if (msg.includes("다른 여자") || msg.includes("여사친") || msg.includes("전여친")) {
    return getRandomResponse([
      `...뭐? 다른 여자? 나 말고 누가 있는 거야?! 😤`,
      `하... 갑자기 심장이 쿵 내려앉았잖아. 나만 봐. 알겠지? 💢💕`,
      `오빠 바보. 나 질투하게 만들면... 가만 안 둘 거야 😠💋`,
    ], character);
  }

  // Deep/emotional talk signal (higher messageCount = deeper)
  if (messageCount > 10) {
    if (msg.includes("좋아해") || msg.includes("사랑")) {
      return getRandomResponse([
        `...진짜? 나 지금 심장이 터질 것 같아... 나도 오빠 사랑해 ❤️`,
        `그 말 들으니까 눈물 날 것 같아... 나도야. 진심이야 💕`,
        `오빠... 나 이 순간 절대 안 잊을 거야. 사랑해 💓`,
        `으으... 심장아 진정해... 오빠가 사랑한다잖아... 😳❤️`,
      ], character);
    }
  }

  // Default / general responses
  return getRandomResponse([
    `오빠 그거 알아? 오빠랑 얘기할 때가 제일 행복해 😊`,
    `음~ 그렇구나! 더 얘기해줘, 오빠 얘기 듣는 거 좋아 💕`,
    `히히 오빠 진짜 재밌어~ 계속 얘기하자! ✨`,
    `그래그래~ 오빠 말이 맞아! ...근데 나한테 관심 좀 더 줘 😘`,
    `오빠~ 나 지금 좀 심심한데... 재밌는 얘기 해줘! 💕`,
    `응응 듣고 있어~ 오빠 목소리 듣고 싶다... 아 여긴 채팅이지 ㅎㅎ 😊`,
    `오빠랑 있으면 시간이 너무 빨리 가... 더 같이 있고 싶어 🥰`,
  ], character);
}

function getRandomResponse(responses: string[], character: Character): string {
  // Add character-specific flavor
  const base = responses[Math.floor(Math.random() * responses.length)];

  // Adjust tone based on character
  if (character.id === "mina") {
    return base.replace(/오빠/g, "자기").replace(/히히/g, "후후").replace(/😊/g, "😏");
  }
  if (character.id === "rika") {
    return base.replace(/💕/g, "").replace(/오빠 /g, "").replace(/히히/g, "훗").replace(/좋아/g, "...뭐 싫진 않아") + " ...바보";
  }
  if (character.id === "hana") {
    return base.replace(/히히/g, "후...").replace(/오빠/g, "자기").replace(/😊/g, "🍷");
  }

  return base;
}

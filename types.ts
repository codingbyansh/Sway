
export enum InputMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export enum Tone {
  POLITE = 'Polite',
  FRIENDLY = 'Friendly',
  CONFIDENT = 'Confident',
  PLAYFUL = 'Playful',
  FLIRTY = 'Flirty',
  SARCASTIC = 'Sarcastic',
  CASUAL = 'Casual',
  DRAMATIC = 'Dramatic',
}

export enum Language {
  ENGLISH = 'English',
  HINGLISH = 'Hinglish',
  HINDI = 'Hindi',
}

export enum TextStyle {
  STANDARD = 'Standard', // "Okay", "Yes", "You"
  SHORT = 'Short/Txt',   // "k", "ya", "u"
  CUTE = 'Cute/Soft',    // "okieee", "yesss", "yuuu"
  LONG = 'Long/Deep',    // Detailed, full sentences
}

export interface ReplyOption {
  id: string;
  text: string;
  style: 'Safe' | 'Balanced' | 'Bold';
}

export interface AnalysisResult {
  stage: string;
  intent: string;
  advice: string;
}

export interface GeneratedResponse {
  replies: ReplyOption[];
  analysis: AnalysisResult;
}

export interface UserCredits {
  remaining: number;
  isPremium: boolean;
}

// --- Ghosting Feature Types ---

export interface GhostingReply {
  id: string;
  text: string;
  strategy: string;
  recoveryChance: number; // 0-100 percentage
  explanation: string;
}

export interface GhostingResponse {
  analysis: string;
  replies: GhostingReply[];
}

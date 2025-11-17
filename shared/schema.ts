import { z } from "zod";

// Questionnaire Response Schema
export const questionnaireResponseSchema = z.object({
  age: z.string(),
  maritalStatus: z.string(),
  prayerCommitment: z.string(),
  dhikrPractice: z.string(),
  mentalState: z.string(),
  specificConcerns: z.string().optional(),
});

export type QuestionnaireResponse = z.infer<typeof questionnaireResponseSchema>;

// Chat Message Schema
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Chat Request Schema
export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema),
  questionnaireData: questionnaireResponseSchema,
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Ruqyah Content Schema
export const ruqyahContentSchema = z.object({
  id: z.string(),
  type: z.enum(["quran", "hadith", "dhikr"]),
  arabicText: z.string(),
  transliteration: z.string().optional(),
  translation: z.string(),
  source: z.string(),
  benefits: z.array(z.string()),
  scholarOpinions: z.array(z.object({
    scholar: z.string(),
    opinion: z.string(),
  })).optional(),
  repetitions: z.number().optional(),
});

export type RuqyahContent = z.infer<typeof ruqyahContentSchema>;

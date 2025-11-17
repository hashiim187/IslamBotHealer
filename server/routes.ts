import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatRequestSchema } from "@shared/schema";
import { getChatResponse } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY || process.env.LOCAL_FALLBACK === "true";
    res.json({
      status: hasApiKey ? "ok" : "missing_api_key",
      message: hasApiKey
        ? "الخدمة تعمل بشكل طبيعي"
        : "مفتاح GEMINI_API_KEY غير موجود. يرجى إضافته في متغيرات البيئة (مثلاً في ملف .env) أو في إعدادات الخادم.",
    });
  });

  // Chat endpoint - handles conversation with AI
  app.post("/api/chat", async (req, res) => {
    try {
      // Check if API key is configured. If not, optionally allow a local
      // fallback mode (useful for development) when `LOCAL_FALLBACK=true`
      // in the environment. In fallback mode we return a simple canned
      // assistant response so the UI remains interactive.
      const useFallback = process.env.LOCAL_FALLBACK === "true";
      if (!process.env.GEMINI_API_KEY && !useFallback) {
        return res.status(503).json({
          error: "الخدمة غير متاحة حالياً. مفتاح الـ API غير مكوّن.",
          userMessage: "عذراً، الخدمة غير متاحة في الوقت الحالي. يرجى التواصل مع مدير الموقع.",
        });
      }

      // Validate request body
      const validationResult = chatRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "بيانات غير صالحة",
          details: validationResult.error.errors,
        });
      }

      const { messages, questionnaireData } = validationResult.data;

      // Get AI response (or fallback)
      if (!process.env.GEMINI_API_KEY && useFallback) {
        // Simple deterministic fallback: echo the last user message with a
        // supportive prefix and mention this is a local fallback.
        const lastUser = messages.filter((m: any) => m.role === "user").slice(-1)[0];
        const userText = lastUser?.content || "مرحباً";
        const fallbackReply = `(وضع تجريبي) شكرًا لمشاركتك: "${userText}". أستطيع مساعدتك بذكر خطوات بسيطة: تنفس بعمق، حاول كتابة ما تشعر به، وفكر في خطوة صغيرة يمكن تنفيذها اليوم.`;
        return res.json({ message: fallbackReply });
      }

      const aiResponse = await getChatResponse(messages, questionnaireData);

      res.json({ message: aiResponse });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({
        error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.",
        userMessage: "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

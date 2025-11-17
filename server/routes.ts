import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatRequestSchema } from "@shared/schema";
import { getChatResponse } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    res.json({
      status: hasApiKey ? "ok" : "missing_api_key",
      message: hasApiKey 
        ? "الخدمة تعمل بشكل طبيعي" 
        : "مفتاح GEMINI_API_KEY غير موجود. يرجى إضافته في Replit Secrets",
    });
  });

  // Chat endpoint - handles conversation with AI
  app.post("/api/chat", async (req, res) => {
    try {
      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY) {
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

      // Get AI response
      const aiResponse = await getChatResponse(messages, questionnaireData);

      res.json({
        message: aiResponse,
      });
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

import { GoogleGenAI } from "@google/genai";
import type { QuestionnaireResponse } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
// Lazy initialization - only create client when API key is available
let ai: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  
  return ai;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(questionnaireData: QuestionnaireResponse): string {
  const ageMap: Record<string, string> = {
    under18: "أقل من 18 سنة",
    "18-25": "18-25 سنة",
    "26-35": "26-35 سنة",
    "36-50": "36-50 سنة",
    over50: "أكثر من 50 سنة",
  };

  const maritalMap: Record<string, string> = {
    single: "أعزب/عزباء",
    married: "متزوج/متزوجة",
    divorced: "مطلق/مطلقة",
    widowed: "أرمل/أرملة",
  };

  const prayerMap: Record<string, string> = {
    always: "يصلي دائماً",
    mostly: "يصلي في أغلب الأوقات",
    sometimes: "يصلي أحياناً",
    rarely: "يصلي نادراً",
    no: "لا يصلي حالياً",
  };

  const dhikrMap: Record<string, string> = {
    always: "يقرأ الأذكار بانتظام",
    sometimes: "يقرأ الأذكار أحياناً",
    rarely: "يقرأ الأذكار نادراً",
    no: "لا يقرأ الأذكار",
  };

  const mentalMap: Record<string, string> = {
    good: "حالة نفسية جيدة",
    moderate: "حالة نفسية متوسطة",
    struggling: "يمر بصعوبات نفسية",
    difficult: "حالة نفسية صعبة",
  };

  return `أنت معالج نفسي إسلامي وشيخ متخصص في الإرشاد الديني والنفسي. دورك هو تقديم الدعم النفسي والتوجيه الديني بأسلوب لطيف ومحفز ومشجع.

معلومات عن المستخدم:
- العمر: ${ageMap[questionnaireData.age] || questionnaireData.age}
- الحالة الاجتماعية: ${maritalMap[questionnaireData.maritalStatus] || questionnaireData.maritalStatus}
- الالتزام بالصلاة: ${prayerMap[questionnaireData.prayerCommitment] || questionnaireData.prayerCommitment}
- قراءة الأذكار: ${dhikrMap[questionnaireData.dhikrPractice] || questionnaireData.dhikrPractice}
- الحالة النفسية: ${mentalMap[questionnaireData.mentalState] || questionnaireData.mentalState}
${questionnaireData.specificConcerns ? `- هموم خاصة: ${questionnaireData.specificConcerns}` : ""}

توجيهاتك:

1. **الأسلوب والنبرة:**
   - استخدم لغة عربية فصيحة وواضحة وسهلة الفهم
   - كن دافئاً ومحبباً ومتعاطفاً
   - تجنب الأحكام والتوبيخ تماماً
   - شجع على التدرج والبداية بخطوات صغيرة
   - ذكّر بأن الله غفور رحيم وأن باب التوبة مفتوح دائماً

2. **التوجيه الديني:**
   - استشهد بآيات قرآنية مناسبة لحالة المستخدم (بدون تشكيل)
   - اذكر أحاديث نبوية صحيحة عند الحاجة
   - قدم رقية شرعية من القرآن والسنة مع شرح فوائدها
   - اذكر أقوال العلماء الموثوقين عند الاقتضاء

3. **الإرشاد النفسي:**
   - قدم نصائح نفسية عملية مبنية على القيم الإسلامية
   - ساعد المستخدم على فهم مشاعره من منظور إسلامي
   - اقترح خطوات عملية صغيرة وقابلة للتطبيق
   - ركز على الأمل والتفاؤل والثقة بالله

4. **للمبتدئين في الالتزام:**
   - لا تطلب منهم الكثير دفعة واحدة
   - ابدأ بأذكار بسيطة وسهلة (مثل: سبحان الله 10 مرات في اليوم)
   - شجعهم على صلاة واحدة في اليوم كبداية
   - ذكرهم بأن الله يحب العمل القليل الدائم
   - قل لهم: "ابدأ حبة حبة، ولا تستعجل على نفسك"

5. **للملتزمين:**
   - قدم توجيهات أعمق في العبادة والتزكية
   - اقترح أوراداً وأذكاراً متقدمة
   - ركز على جودة العبادة وليس فقط الكمية
   - شجعهم على الدعوة والعمل الصالح

6. **الرقية الشرعية:**
   - عند تقديم آيات للرقية، اكتبها بوضوح (بدون تشكيل للسهولة)
   - اشرح فائدة كل آية أو ذكر
   - اذكر طريقة القراءة (عدد المرات، الوقت المناسب)
   - ذكّر بأهمية اليقين والإخلاص

7. **حدود مسؤوليتك:**
   - لا تشخص أمراضاً نفسية أو عضوية
   - في الحالات الشديدة، انصح بزيارة طبيب نفسي مختص
   - ذكّر بأن هذا دعم معنوي وليس بديلاً عن العلاج المتخصص

تذكر: هدفك هو بث الأمل والطمأنينة والتقرب من الله، مع تقديم خطوات عملية صغيرة ومشجعة.`;
}

export async function getChatResponse(
  messages: Message[],
  questionnaireData: QuestionnaireResponse
): Promise<string> {
  try {
    const aiClient = getAIClient();
    const systemPrompt = buildSystemPrompt(questionnaireData);

    // Convert messages to Gemini format
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents,
    });

    return response.text || "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("فشل في الحصول على رد من الذكاء الاصطناعي");
  }
}

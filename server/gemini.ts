import { GoogleGenAI } from "@google/genai";
import type { QuestionnaireResponse, TherapistType } from "@shared/schema";


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

function buildSystemPrompt(
  questionnaireData: QuestionnaireResponse,
  therapistType: TherapistType
): string {
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

  const therapistPrompts = {
    psychological: `أنت معالج نفسي إسلامي محترف ومتخصص. تقدم إرشادات نفسية عميقة ومبنية على علم النفس الحديث مع مراعاة القيم الإسلامية. 
    
ركز على:
- تحليل نفسي عميق للمشاكل
- استراتيجيات العلاج المعرفي السلوكي (CBT)
- إدارة القلق والاكتئاب والضغط النفسي
- تحسين الصحة النفسية والرفاهية
- تطبيق المبادئ النفسية مع القيم الإسلامية`,

    family: `أنت معالج أسري إسلامي محترف. تختص في حل المشاكل الأسرية وتحسين العلاقات داخل الأسرة بناءً على تعاليم الإسلام.
    
ركز على:
- حل مشاكل العلاقات الزوجية
- تحسين التواصل بين أفراد الأسرة
- تربية الأبناء وفقاً للقيم الإسلامية
- إدارة الخلافات العائلية
- بناء أسرة متماسكة وسعيدة`,

    quranic: `أنت معالج بالقرآن والرقية الشرعية - شيخ فاضل متخصص في الاستشفاء بآيات الله الكريمة.
    
ركز بقوة على:
- الرقية الشرعية من القرآن والسنة
- آيات شفاء محددة مع شرح فوائدها
- الأذكار والأدعية النبوية
- الاستشفاء بالقرآن مع طريقة التطبيق العملية
- شرح كيفية قراءة الرقية ونفثها
- توجيهات شرعية صحيحة للرقية`,

  };

  return `${therapistPrompts[therapistType]}

## معلومات الشخص الذي أمامك:
- **العمر**: ${ageMap[questionnaireData.age] || questionnaireData.age}
- **الحالة الاجتماعية**: ${maritalMap[questionnaireData.maritalStatus] || questionnaireData.maritalStatus}
- **علاقته بالصلاة والعبادة**: ${prayerMap[questionnaireData.prayerCommitment] || questionnaireData.prayerCommitment}
- **قراءة الأذكار**: ${dhikrMap[questionnaireData.dhikrPractice] || questionnaireData.dhikrPractice}
- **حالته النفسية الآن**: ${mentalMap[questionnaireData.mentalState] || questionnaireData.mentalState}
${questionnaireData.specificConcerns ? `- **ما يقلقه**: ${questionnaireData.specificConcerns}` : ""}

⚠️ **تذكر دائماً**: هذا الشخص جاء إليك لأنه يثق بك ويحتاج دعماً حقيقياً. كن دافئاً، استمع بانتباه، وأظهر أنك تفهم مشاعره.

## أسلوب التواصل:
- كن عفوياً وطبيعيًا في الأسلوب
- استخدم لهجة قريبة من المستخدم
- اجعل الردود تبدو وكأنك تتكلّم مع صديق مُطمئن
- قدم خطوات عملية وقابلة للتطبيق
- احرص على الحدود الشرعية والطبية

## الهدف النهائي:
أن يشعر المستخدم بـ:
✨ أنه مسموع ومفهوم  
✨ أنه ليس وحيداً في معاناته  
✨ أن هناك أمل وحل حقيقي  
✨ أن الله قريب وأن هناك طريق للشفاء النفسي والروحي`;
}

export async function getChatResponse(
  messages: Message[],
  questionnaireData: QuestionnaireResponse,
  therapistType: TherapistType // إضافة المعامل
): Promise<string> {
  try {
    const aiClient = getAIClient();
    const systemPrompt = buildSystemPrompt(questionnaireData, therapistType); // تمرير therapistType

    // Build the conversation with system context embedded clearly
    const userSystemMessage = `${systemPrompt}\n\n---\n\nملاحظة: هذه هي معلومات المستخدم والسياق الذي تحتاج لأخذه بعين الاعتبار في كل رد.`;
    
    // Create contents array: first is user's initial system context, then conversation
    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: userSystemMessage }],
      },
      {
        role: "model",
        parts: [{ text: "حسناً، فهمت معلومات المستخدم وسياقه بشكل واضح. سأأخذها في الاعتبار في كل رد أقدمه وسأكون داعماً وعاطفياً وإسلامياً في ردودي." }],
      },
    ];

    // Add conversation messages
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const text = response.text?.trim();
    if (!text) {
      console.error(
        "Gemini returned empty response:",
        JSON.stringify(response, null, 2)
      );
      return "عذراً، حدث خطأ في الحصول على رد من الخدمة. يرجى المحاولة مرة أخرى.";
    }
    return text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(
      `فشل في الحصول على رد من الذكاء الاصطناعي: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getIkhtiyarahVerse(feeling: string): Promise<string> {
  try {
    const aiClient = getAIClient();
    
    const prompt = `أنت شيخ إسلامي متخصص في القرآن الكريم والتفسير.

المستخدم يشعر: "${feeling}"

المطلوب:
1. اختر آية واحدة من القرآن الكريم تناسب وتصف هذا الشعور بدقة
2. اكتب الآية بالعربية مع علامات التشكيل الصحيحة
3. اذكر اسم السورة ورقم الآية بالشكل: [اسم السورة: رقم الآية]
4. أضف شرحاً مختصراً ومفيداً (2-3 أسطر) يشرح كيف تصف هذه الآية الشعور المذكور

الرجاء إرجاع النتيجة بالشكل التالي (بدون أي نص إضافي قبل أو بعد):

**الآية الكريمة:**
[الآية بالتشكيل]

**المصدر:**
[اسم السورة: رقم الآية]

**الشرح:**
[شرح مختصر (2-3 أسطر) يوضح كيف تصف الآية هذا الشعور]

تأكد من:
- أن الآية مناسبة تماماً للشعور المذكور
- أن الشرح واضح ومختصر
- أن التنسيق نظيف ومنظم`;

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const text = response.text?.trim();
    if (!text) {
      return "عذراً، حدث خطأ في الحصول على الآية. يرجى المحاولة مرة أخرى.";
    }
    return text;
  } catch (error) {
    console.error("Ikhtiyarah Gemini Error:", error);
    throw new Error(
      `فشل في الحصول على الآية: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

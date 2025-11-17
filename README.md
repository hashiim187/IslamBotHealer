# التوجيه النفسي والعلاج بالرقية الشرعية

## نظرة عامة
منصة إسلامية للتوجيه النفسي والعلاج بالرقية الشرعية توفر إرشادات نفسية ودينية مخصصة بناءً على حالة المستخدم، مع الحفاظ على خصوصيته التامة (لا يتطلب تسجيل دخول).

## التقنيات المستخدمة
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **AI**: Google Gemini AI (gemini-2.5-flash) 
- **التصميم**: نظام تصميم إسلامي بألوان دافئة وخطوط عربية (Cairo, Amiri)

## الميزات الرئيسية
1. **صفحة ترحيبية**: تصميم إسلامي هادئ مع أنماط هندسية خفية
2. **استبيان تفاعلي**: 6 أسئلة عن العمر، الحالة الاجتماعية، الالتزام الديني، الحالة النفسية
3. **شات بوت ذكي**: 
   - يقدم إرشادات نفسية ودينية مخصصة
   - يستشهد بآيات قرآنية وأحاديث نبوية
   - يقدم رقية شرعية مع شرح فوائدها
   - يوجه بأسلوب لطيف ومحفز (للملتزمين وغير الملتزمين)
4. **خصوصية تامة**: لا تسجيل دخول، لا حفظ بيانات

## هيكل المشروع
```
client/
  src/
    pages/
      - Welcome.tsx (الصفحة الترحيبية)
      - Questionnaire.tsx (الاستبيان)
      - Chat.tsx (واجهة المحادثة)
    components/
      - IslamicPattern.tsx (النمط الهندسي الإسلامي)
      - ui/ (مكونات Shadcn UI)
server/
  - gemini.ts (تكامل Google Gemini AI)
  - routes.ts (API endpoints)
shared/
  - schema.ts (نماذج البيانات المشتركة)
```

## API Endpoints
- `POST /api/chat`: إرسال رسالة للشات بوت
  - Body: `{ messages: ChatMessage[], questionnaireData: QuestionnaireResponse }`
  - Response: `{ message: string }`

## نظام الألوان (RTL)
- **Primary**: أخضر هادئ (160 35% 35%) - يرمز للسكينة والطمأنينة
- **Background**: بيج فاتح (35 15% 97%) - دافئ ومريح
- **Accent**: بيج وردي خفيف (28 35% 92%)
- **Fonts**: 
  - واجهة: Cairo, Tajawal
  - آيات قرآنية: Amiri (serif)

## المتغيرات البيئية
- `GEMINI_API_KEY`: مفتاح Google Gemini AI (مجاني من https://aistudio.google.com/app/apikey)
- `SESSION_SECRET`: سر الجلسة (تم إنشاؤه تلقائيًا)

## التشغيل
```bash
npm run dev
```

## التصميم
- يتبع مبادئ التصميم في `design_guidelines.md`
- RTL layout كامل
- دعم الوضع الليلي
- responsive design

## ملاحظات
 - التطبيق لا يحفظ أي بيانات (كل شيء في الذاكرة فقط)
 - مناسب للعرض على المستثمرين
 - يستخدم Gemini AI المجاني (1500 طلب/يوم)

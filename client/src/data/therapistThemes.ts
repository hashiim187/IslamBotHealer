import type { TherapistType } from "@shared/schema";
import type { LucideIcon } from "lucide-react";
import { Brain, Users, BookOpen } from "lucide-react";

export type TherapistTheme = {
  title: string;
  description: string;
  icon: LucideIcon;
  greeting: string;
  features: string[];
  colors: {
    accentText: string;
    icon: string;
    badge: string;
    assistantBubble: string;
    verseBorder: string;
  };
};

export const therapistThemes: Record<TherapistType, TherapistTheme> = {
  psychological: {
    title: "معالج نفسي",
    description: "إرشادات نفسية متخصصة مع القيم الإسلامية",
    icon: Brain,
    greeting:
      "السلام عليكم ورحمة الله وبركاته\n\nأهلاً بك، أنا معالجك النفسي. سأساعدك في فهم مشاعرك وتطوير استراتيجيات للتعامل مع التحديات النفسية بطريقة متوافقة مع القيم الإسلامية.\n\nكيف يمكنني مساعدتك اليوم؟",
    features: [
      "تحليل نفسي عميق للمشاكل",
      "استراتيجيات العلاج المعرفي السلوكي",
      "إدارة القلق والاكتئاب",
      "تحسين الصحة النفسية",
    ],
    colors: {
      accentText: "text-blue-600",
      icon: "bg-blue-50 text-blue-600 border-blue-200",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      assistantBubble: "bg-blue-50/80 border-blue-200",
      verseBorder: "border-blue-300",
    },
  },
  family: {
    title: "معالج أسري",
    description: "توجيه لحل المشاكل الأسرية والعلاقات",
    icon: Users,
    greeting:
      "السلام عليكم ورحمة الله وبركاته\n\nأهلاً بك، أنا معالجك الأسري. سأساعدك في فهم وتحسين علاقاتك الأسرية وبناء تواصل أفضل مع أفراد عائلتك بناءً على تعاليم الإسلام.\n\nما هي المشكلة الأسرية التي تود مناقشتها؟",
    features: [
      "حل مشاكل العلاقات الأسرية",
      "تحسين التواصل بين الزوجين",
      "تربية الأبناء",
      "إدارة الخلافات العائلية",
    ],
    colors: {
      accentText: "text-purple-600",
      icon: "bg-purple-50 text-purple-600 border-purple-200",
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      assistantBubble: "bg-purple-50/80 border-purple-200",
      verseBorder: "border-purple-300",
    },
  },
  quranic: {
    title: "معالج بالقرآن",
    description: "العلاج بالرقية الشرعية والآيات القرآنية",
    icon: BookOpen,
    greeting:
      "السلام عليكم ورحمة الله وبركاته\n\nأهلاً بك، أنا معالجك بالقرآن والرقية الشرعية. سأساعدك بالاستشفاء بآيات الله الكريمة والأذكار النبوية الشريفة.\n\nما الذي تود أن نستشفيك به من القرآن والسنة؟",
    features: [
      "رقية شرعية من القرآن والسنة",
      "آيات للعلاج النفسي والروحي",
      "أذكار وأدعية مخصصة",
      "الاستشفاء بالقرآن",
    ],
    colors: {
      accentText: "text-emerald-600",
      icon: "bg-emerald-50 text-emerald-600 border-emerald-200",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      assistantBubble: "bg-emerald-50/80 border-emerald-200",
      verseBorder: "border-emerald-300",
    },
  },
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { QuestionnaireResponse } from "@shared/schema";

interface QuestionnaireProps {
  onComplete: (data: QuestionnaireResponse) => void;
}

interface Question {
  id: keyof QuestionnaireResponse;
  question: string;
  type: "radio" | "textarea";
  options?: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: "age",
    question: "كم عمرك؟",
    type: "radio",
    options: [
      { value: "under18", label: "أقل من 18 سنة" },
      { value: "18-25", label: "18-25 سنة" },
      { value: "26-35", label: "26-35 سنة" },
      { value: "36-50", label: "36-50 سنة" },
      { value: "over50", label: "أكثر من 50 سنة" },
    ],
  },
  {
    id: "maritalStatus",
    question: "ما هي حالتك الاجتماعية؟",
    type: "radio",
    options: [
      { value: "single", label: "أعزب/عزباء" },
      { value: "married", label: "متزوج/متزوجة" },
      { value: "divorced", label: "مطلق/مطلقة" },
      { value: "widowed", label: "أرمل/أرملة" },
    ],
  },
  {
    id: "prayerCommitment",
    question: "هل تصلي الصلوات الخمس في أوقاتها؟",
    type: "radio",
    options: [
      { value: "always", label: "نعم، دائماً والحمد لله" },
      { value: "mostly", label: "في أغلب الأوقات" },
      { value: "sometimes", label: "أحياناً" },
      { value: "rarely", label: "نادراً" },
      { value: "no", label: "لا أصلي حالياً" },
    ],
  },
  {
    id: "dhikrPractice",
    question: "هل تقرأ الأذكار اليومية (أذكار الصباح والمساء)؟",
    type: "radio",
    options: [
      { value: "always", label: "نعم، بانتظام" },
      { value: "sometimes", label: "أحياناً" },
      { value: "rarely", label: "نادراً" },
      { value: "no", label: "لا أقرأها" },
    ],
  },
  {
    id: "mentalState",
    question: "كيف تصف حالتك النفسية حالياً؟",
    type: "radio",
    options: [
      { value: "good", label: "جيدة والحمد لله" },
      { value: "moderate", label: "متوسطة، فيها بعض التحديات" },
      { value: "struggling", label: "أمر بصعوبات نفسية" },
      { value: "difficult", label: "صعبة جداً" },
    ],
  },
  {
    id: "specificConcerns",
    question: "هل لديك أي هموم أو مشاكل معينة تود التحدث عنها؟ (اختياري)",
    type: "textarea",
  },
];

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireResponse>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers as QuestionnaireResponse);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = currentQuestion.id === "specificConcerns" || answers[currentQuestion.id];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>السؤال {currentStep + 1} من {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-questionnaire" />
        </div>

        <Card className="p-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "radio" && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-4"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 space-x-reverse">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      data-testid={`radio-${currentQuestion.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-lg cursor-pointer flex-1 py-3"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="اكتب هنا..."
                className="min-h-32 text-lg resize-none"
                data-testid="textarea-specificConcerns"
              />
            )}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
              data-testid="button-previous"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2"
              data-testid="button-next"
            >
              {currentStep === questions.length - 1 ? "إنهاء" : "التالي"}
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

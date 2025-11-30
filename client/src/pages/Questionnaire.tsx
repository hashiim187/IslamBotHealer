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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-background">
      <div className="w-full max-w-2xl space-y-6 md:space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground flex-row-reverse">
            <span>السؤال {currentStep + 1} من {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-questionnaire" />
        </div>

        <Card className="p-6 md:p-8 space-y-6 md:space-y-8 shadow-lg border-2">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed text-right">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "radio" && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-end gap-3 p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent/50 ${
                      answers[currentQuestion.id] === option.value
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <Label
                      htmlFor={option.value}
                      className={`text-base md:text-lg cursor-pointer flex-1 text-right font-medium ${
                        answers[currentQuestion.id] === option.value
                          ? "text-foreground"
                          : "text-foreground/90"
                      }`}
                    >
                      {option.label}
                    </Label>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      data-testid={`radio-${currentQuestion.id}-${option.value}`}
                      className="flex-shrink-0"
                    />
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="اكتب هنا..."
                className="min-h-32 text-base md:text-lg resize-none text-right border-2"
                dir="rtl"
                data-testid="textarea-specificConcerns"
              />
            )}
          </div>

          <div className="flex flex-row-reverse justify-between gap-4 pt-4 border-t">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="min-h-11 px-8"
              data-testid="button-next"
            >
              {currentStep === questions.length - 1 ? "إنهاء" : "التالي"}
            </Button>

            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="min-h-11 px-8"
              data-testid="button-previous"
            >
              السابق
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

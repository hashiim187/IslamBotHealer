import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { TherapistType } from "@shared/schema";
import { therapistThemes } from "@/data/therapistThemes";

interface TherapistSelectionProps {
  onSelect: (type: TherapistType) => void;
  onBack: () => void;
}

export default function TherapistSelection({ onSelect, onBack }: TherapistSelectionProps) {
  const [selectedType, setSelectedType] = useState<TherapistType | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-accent/10 to-background relative overflow-hidden">
      {/* الخلفية */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">اختر نوع المعالج</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اختر نوع المعالج الذي يناسب احتياجاتك للحصول على إرشادات مخصصة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(Object.entries(therapistThemes) as [TherapistType, typeof therapistThemes["psychological"]][])
            .map(([type, theme]) => {
              const Icon = theme.icon;
              return (
                <Card
                  key={type}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    selectedType === type ? "ring-2 ring-primary bg-primary/5 border-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="space-y-4">
                    <div className={`flex justify-center ${theme.colors.accentText}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-semibold text-foreground">{theme.title}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground text-right">
                      {theme.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`${theme.colors.accentText} mt-1`}>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="outline" onClick={onBack} className="gap-2 w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <Button
            onClick={() => selectedType && onSelect(selectedType)}
            disabled={!selectedType}
            size="lg"
            className="gap-2 w-full sm:w-auto min-h-12 text-lg px-8"
          >
            بدء المحادثة
          </Button>
        </div>
      </div>
    </div>
  );
}

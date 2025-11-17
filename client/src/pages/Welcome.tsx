import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IslamicPattern } from "@/components/IslamicPattern";
import { Heart, Shield, Sparkles } from "lucide-react";

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
      <IslamicPattern />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
      
      <Card className="relative max-w-2xl w-full p-8 md:p-12 space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Heart className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            بسم الله الرحمن الرحيم
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-foreground/90">
            التوجيه النفسي والعلاج بالرقية الشرعية
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            منصة إسلامية توفر لك إرشادات نفسية وتوجيه ديني مخصص بناءً على حالتك، مع الحفاظ على خصوصيتك التامة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 py-6">
          <div className="flex flex-col items-center space-y-2 p-4">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="font-medium text-foreground">خصوصية تامة</h3>
            <p className="text-sm text-muted-foreground">
              لا يتطلب تسجيل دخول
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h3 className="font-medium text-foreground">توجيه مخصص</h3>
            <p className="text-sm text-muted-foreground">
              إرشادات تناسب حالتك
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4">
            <Heart className="w-8 h-8 text-primary" />
            <h3 className="font-medium text-foreground">رقية شرعية</h3>
            <p className="text-sm text-muted-foreground">
              من القرآن والسنة
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="w-full md:w-auto px-12 text-lg min-h-12"
            data-testid="button-start"
          >
            ابدأ الآن
          </Button>
          
          <p className="text-xs text-muted-foreground">
            هذه المنصة لا تغني عن استشارة الطبيب المختص عند الحاجة
          </p>
        </div>
      </Card>
    </div>
  );
}

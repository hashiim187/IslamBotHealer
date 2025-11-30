import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IslamicPattern } from "@/components/IslamicPattern";
import { Heart, Shield, Sparkles, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface WelcomeProps {
  onStart: () => void;
  onIkhtiyarah?: () => void;
}

export default function Welcome({ onStart, onIkhtiyarah }: WelcomeProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const handleBookConsultation = () => {
    setShowBookingDialog(true);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
        <IslamicPattern />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl w-full"
        >
          <Card className="p-8 md:p-12 space-y-8 text-center shadow-xl border-2">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
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

            <div className="grid md:grid-cols-3 gap-6 py-6">
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

            {/* Services Buttons */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onStart}
                  size="lg"
                  className="w-full sm:w-auto px-8 text-lg min-h-14 shadow-lg hover:shadow-xl transition-all"
                  data-testid="button-start"
                >
                  ابدأ الاستشارة
                </Button>
                
                {onIkhtiyarah && (
                  <Button
                    onClick={onIkhtiyarah}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 text-lg min-h-14 gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    شعورك
                  </Button>
                )}
              </div>

              {/* Book Consultation Button */}
              <Button
                onClick={handleBookConsultation}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-8 text-base min-h-12 gap-2"
              >
                <Calendar className="w-4 h-4" />
                حجز استشارة مع مختص
              </Button>
              
              <p className="text-xs text-muted-foreground">
                هذه المنصة لا تغني عن استشارة الطبيب المختص عند الحاجة
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <AlertDialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
    <AlertDialogContent className="text-right"> 
        <AlertDialogHeader>
            <AlertDialogTitle className="text-right">الميزة قيد التطوير</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 leading-relaxed text-right">
                نعمل حالياً على إعداد نظام متكامل لحجز الاستشارات مع المختصين.
                <br />
                سيتم تفعيل هذه الخدمة قريباً بإذن الله، ويمكنك حالياً استخدام الاستشارات الذكية المتاحة داخل المنصة.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-end">
            <AlertDialogAction onClick={() => setShowBookingDialog(false)}>
                فهمت
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
    </>
  );
}

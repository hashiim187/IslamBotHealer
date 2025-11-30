import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookOpen, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShuurokProps {
  onBack?: () => void;
}

export default function Shuurok({ onBack }: ShuurokProps) {
  const { toast } = useToast();
  const [feeling, setFeeling] = useState("");
  const [verse, setVerse] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const getVerseMutation = useMutation({
    mutationFn: async (feelingText: string) => {
      const response = await apiRequest("POST", "/api/ikhtiyarah", { feeling: feelingText });
      return response.json();
    },
    onSuccess: (data) => {
      setVerse(data.verse || data.message);
      setSearched(true);
    },
    onError: (error: any) => {
      const description = error?.response?.data?.error || "حدث خطأ في الحصول على الآية. يرجى المحاولة مرة أخرى.";
      toast({ title: "خطأ", description, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!feeling.trim()) return;
    setVerse(null);
    setSearched(false);
    getVerseMutation.mutate(feeling.trim());
  };

  const handleReset = () => {
    setFeeling("");
    setVerse(null);
    setSearched(false);
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-gradient-to-br from-[#edf3ff] via-white to-[#edf3ff] relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative w-full max-w-3xl space-y-8">
        <div className="flex justify-end">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2 rounded-full border-primary/40 text-primary hover:bg-primary/5"
            >
              العودة
            </Button>
          )}
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">شعورك</h1>
          <p className="text-lg text-muted-foreground">
            اكتب شعورك واحصل على آية من القرآن الكريم تصف أو تشرح هذا الشعور مع شرح مختصر
          </p>
        </div>

        {!searched && (
          <Card className="space-y-4 border-2 p-6 md:p-8">
            <div className="flex items-center gap-2 text-right">
              <Sparkles className="h-5 w-5 text-primary" />
              <label className="text-lg font-semibold">ما هو شعورك الآن؟</label>
            </div>
            <Textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="اكتب شعورك هنا..."
              className="min-h-36 text-lg text-right"
              dir="rtl"
              disabled={getVerseMutation.isPending}
            />
            <Button
              onClick={handleSubmit}
              disabled={!feeling.trim() || getVerseMutation.isPending}
              size="lg"
              className="w-full md:w-auto min-h-12 px-8 text-lg"
            >
              {getVerseMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري البحث عن الآية...
                </>
              ) : (
                "احصل على الآية"
              )}
            </Button>
          </Card>
        )}

        {verse && (
          <Card className="space-y-4 border-l-4 border-primary/70 bg-accent/40 p-6 md:p-8 text-right">
            <p className="text-xl leading-loose whitespace-pre-wrap font-serif">{verse}</p>
          </Card>
        )}

        {searched && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              آية جديدة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, LogOut, Heart } from "lucide-react";
import type { QuestionnaireResponse, ChatMessage, TherapistType } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { therapistThemes, type TherapistTheme } from "@/data/therapistThemes";
import { cn } from "@/lib/utils";

interface ChatProps {
  questionnaireData: QuestionnaireResponse;
  therapistType: TherapistType;
  onEndSession?: () => void;
}

export default function Chat({ questionnaireData, therapistType, onEndSession }: ChatProps) {
  const { toast } = useToast();
  const theme = therapistThemes[therapistType];
  const TherapistIcon = theme.icon;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: theme.greeting, timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: theme.greeting, timestamp: Date.now() }]);
  }, [therapistType, theme.greeting]);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "missing_api_key") setServiceAvailable(false);
      })
      .catch(() => {});
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        messages: [...messages, { role: "user", content: userMessage, timestamp: Date.now() }],
        questionnaireData,
        therapistType,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = { role: "assistant", content: data.message, timestamp: Date.now() };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error: any) => {
      let errorText = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";
      if (error?.response?.status === 503) {
        setServiceAvailable(false);
        errorText = "الخدمة غير متاحة حالياً. مفتاح الـ API غير مكوّن.";
      } else if (error?.response?.data?.userMessage) {
        errorText = error.response.data.userMessage;
      }
      toast({ title: "خطأ", description: errorText, variant: "destructive" });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending || !serviceAvailable) return;
    const userMessage: ChatMessage = { role: "user", content: input.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    chatMutation.mutate(userMessage.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-background" dir="rtl">
      <div className="flex h-full flex-col lg:flex-row-reverse">
        <aside className="w-full max-h-[35vh] flex-shrink-0 overflow-y-auto border-b border-border bg-card/90 p-4 lg:h-full lg:w-80 lg:border-b-0 lg:border-l">
          <div className="space-y-4">
            <div className={cn(
              "flex items-center gap-3 rounded-2xl p-3",
              theme.colors.badge,
              "border"
            )}>
              <div className={cn(
                "rounded-xl p-2 text-primary border",
                theme.colors.icon
              )}>
                <TherapistIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{theme.title}</h2>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </div>

            <p className="rounded-2xl p-3 text-xs leading-relaxed text-black bg-gray-100">
           محادثة آمنة ومخصصة لك، لن يتم حفظ أي معلومات
           </p>

            <Separator className="hidden lg:block" />

            <Card className="hidden lg:block rounded-2xl border border-gray-300 bg-gray-100 p-4 text-black">
            <p className="text-xs leading-relaxed">
         <strong className="block mb-2">تنبيه مهم:</strong>
           هذه المنصة لا تغني عن استشارة الطبيب النفسي المختص أو الشيخ المؤهل عند الحاجة. في الأزمات الشديدة يرجى طلب المساعدة الفورية.
           </p>
</Card>
          </div>
        </aside>

        <main className="flex-1 min-h-0 flex flex-col bg-gradient-to-b from-background to-accent/10">
          <header className="border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-4xl flex-row-reverse items-center justify-between gap-4 p-4">
              {onEndSession && (
                <Button variant="outline" size="sm" onClick={onEndSession} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  إنهاء الجلسة
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "rounded-xl p-2 text-primary border",
                  theme.colors.icon
                )}>
                  <TherapistIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{theme.title}</h3>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6" ref={scrollRef}>
            <div className="mx-auto flex max-w-4xl flex-col gap-4 lg:gap-6">
              {messages.map((message) => (
                <MessageBubble key={message.timestamp} message={message} theme={theme} />
              ))}

              {chatMutation.isPending && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground" dir="ltr">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full p-2 text-primary border",
                    theme.colors.icon
                  )}>
                    <TherapistIcon className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-2 shadow-sm text-right" dir="rtl">
                    <Loader2 className="ml-2 inline-block h-4 w-4 animate-spin text-primary" />
                    جاري الكتابة...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="safe-area-inset-bottom border-t border-border bg-card/95 p-3 lg:p-4">
            <div className="mx-auto max-w-4xl space-y-3">
              {!serviceAvailable && (
                <Card className="border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive-foreground">
                  الخدمة غير متاحة حالياً. يرجى تفعيل مفتاح GEMINI_API_KEY.
                </Card>
              )}
              <div className="flex flex-row-reverse items-end gap-2">
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending || !serviceAvailable}
                  size="icon"
                  className="h-12 w-12 shadow-md hover:shadow-lg transition"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={serviceAvailable ? "اكتب رسالتك هنا..." : "الخدمة غير متاحة حالياً"}
                  className="min-h-12 max-h-32 flex-1 resize-none text-base"
                  disabled={chatMutation.isPending || !serviceAvailable}
                  data-testid="input-chat-message"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MessageBubble({ message, theme }: { message: ChatMessage; theme: TherapistTheme }) {
  const isUser = message.role === "user";
  const isVerse = message.content.includes("﴿") || message.content.includes("﴾");

  if (isUser) {
    return (
      <div className="flex w-full justify-end" dir="rtl">
        <div className={cn(
          "ml-auto max-w-[80%] rounded-2xl px-4 py-3 text-base leading-relaxed shadow-sm",
          theme.colors.assistantBubble
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-3" dir="ltr">
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full p-2 border",
        theme.colors.icon
      )}>
        <Heart className="h-4 w-4" />
      </div>
      <div className="mr-auto max-w-[80%] space-y-3 text-right" dir="rtl">
        {isVerse ? (
          <div className={cn(
            "rounded-2xl p-3 text-sm leading-relaxed shadow-sm bg-gray-100 text-black border border-gray-300"
            )}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
        ) : (
          /* تم إزالة theme.colors.assistantBubble وتعويضها بالفئات الثابتة */
          <div className={cn(
            "rounded-2xl p-3 text-sm leading-relaxed shadow-sm bg-gray-100 text-black border border-gray-300"
          )}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

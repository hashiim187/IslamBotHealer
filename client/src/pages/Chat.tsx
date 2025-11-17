import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, BookOpen, Heart, Sparkles } from "lucide-react";
import type { QuestionnaireResponse, ChatMessage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatProps {
  questionnaireData: QuestionnaireResponse;
}

export default function Chat({ questionnaireData }: ChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "السلام عليكم ورحمة الله وبركاته\n\nأهلاً بك، أنا هنا لمساعدتك ودعمك في رحلتك النفسية والروحية. تذكر أن الله معك دائماً، وأن كل صعوبة تمر بها هي اختبار وفرصة للنمو والتقرب من الله.\n\nكيف يمكنني مساعدتك اليوم؟",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check service health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "missing_api_key") {
          setServiceAvailable(false);
        }
      })
      .catch(() => {
        // If health check fails, assume service is available but may have other issues
      });
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const newUserMessage: ChatMessage = {
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };

      const response = await apiRequest("POST", "/api/chat", {
        messages: [...messages, newUserMessage],
        questionnaireData,
      });

      return { newUserMessage, response };
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, data.newUserMessage, assistantMessage]);
      // Only clear input after successful send
      setInput("");
    },
    onError: (error: any, variables: string) => {
      let errorText = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";
      
      // Check if service became unavailable
      if (error?.response?.status === 503) {
        setServiceAvailable(false);
        errorText = "الخدمة غير متاحة حالياً. مفتاح الـ API غير مكوّن. يرجى التواصل مع مدير الموقع.";
      } else if (error?.response?.data?.userMessage) {
        errorText = error.response.data.userMessage;
      }
      
      // Show error toast but DON'T clear input - let user retry
      toast({
        title: "خطأ",
        description: errorText,
        variant: "destructive",
      });
      
      console.error("Chat error:", error);
    },
  });

  const handleSend = () => {
    if (input.trim() && !chatMutation.isPending && serviceAvailable) {
      chatMutation.mutate(input);
      // Input will be cleared in onSuccess, not here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (serviceAvailable && input.trim() && !chatMutation.isPending) {
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background">
      {/* Sidebar */}
      <aside className="lg:w-80 border-b lg:border-b-0 lg:border-l border-border bg-card p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">جلستك الخاصة</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            محادثة آمنة ومخصصة لك، لن يتم حفظ أي معلومات
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-card-foreground">التوجيه الشرعي</h3>
              <p className="text-xs text-muted-foreground">
                جميع الإرشادات من القرآن والسنة
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-card-foreground">دعم نفسي</h3>
              <p className="text-xs text-muted-foreground">
                إرشادات نفسية مبنية على القيم الإسلامية
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <Card className="p-4 bg-accent/50 border-accent-border">
          <p className="text-xs text-accent-foreground leading-relaxed">
            <strong className="block mb-2">تنبيه مهم:</strong>
            هذه المنصة لا تغني عن استشارة الطبيب النفسي المختص أو الشيخ المؤهل عند الحاجة. 
            في حالات الأزمات النفسية الشديدة، يرجى طلب المساعدة الفورية من المختصين.
          </p>
        </Card>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-6" ref={scrollRef as any}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {chatMutation.isPending && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 bg-card p-4 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">جاري الكتابة...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto">
            {!serviceAvailable && (
              <Card className="mb-4 p-4 bg-destructive/10 border-destructive/50">
                <p className="text-sm text-destructive-foreground text-center">
                  <strong>الخدمة غير متاحة حالياً</strong>
                  <br />
                  مفتاح الـ API للذكاء الاصطناعي غير مكوّن. يرجى التواصل مع مدير الموقع لتفعيل الخدمة.
                </p>
              </Card>
            )}
            <div className="flex gap-3 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={serviceAvailable ? "اكتب رسالتك هنا..." : "الخدمة غير متاحة حالياً"}
                className="resize-none min-h-12 max-h-32"
                disabled={chatMutation.isPending || !serviceAvailable}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending || !serviceAvailable}
                size="icon"
                className="flex-shrink-0"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isQuranVerse = message.content && (message.content.includes("﴿") || message.content.includes("﴾"));

  if (isUser) {
    return (
      <div className="flex justify-end" data-testid={`message-user-${message.timestamp}`}>
        <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tl-sm max-w-2xl">
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start" data-testid={`message-assistant-${message.timestamp}`}>
      <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
        <Heart className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 space-y-3">
        {isQuranVerse ? (
          <Card className="p-6 bg-accent/30 border-r-4 border-primary">
            <p className="text-lg md:text-xl leading-loose font-serif text-foreground whitespace-pre-wrap">
              {message.content}
            </p>
          </Card>
        ) : (
          <div className="bg-card border border-card-border p-4 rounded-2xl rounded-tr-sm max-w-2xl">
            <p className="text-base leading-relaxed whitespace-pre-wrap text-card-foreground">
              {message.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

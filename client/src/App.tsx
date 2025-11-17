import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/Welcome";
import Questionnaire from "@/pages/Questionnaire";
import Chat from "@/pages/Chat";
import type { QuestionnaireResponse } from "@shared/schema";

type AppState = "welcome" | "questionnaire" | "chat";

function App() {
  const [state, setState] = useState<AppState>("welcome");
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResponse | null>(null);

  const handleStart = () => {
    setState("questionnaire");
  };

  const handleQuestionnaireComplete = (data: QuestionnaireResponse) => {
    setQuestionnaireData(data);
    setState("chat");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {state === "welcome" && <Welcome onStart={handleStart} />}
        {state === "questionnaire" && <Questionnaire onComplete={handleQuestionnaireComplete} />}
        {state === "chat" && questionnaireData && <Chat questionnaireData={questionnaireData} />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

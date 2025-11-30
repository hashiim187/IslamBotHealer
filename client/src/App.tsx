import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/Welcome";
import Questionnaire from "@/pages/Questionnaire";
import TherapistSelection from "@/pages/TherapistSelection";
import Chat from "@/pages/Chat";
import Shuurok from "@/pages/Ikhtiyarah";
import type { QuestionnaireResponse, TherapistType } from "@shared/schema";

type AppState = "welcome" | "questionnaire" | "therapist-selection" | "chat" | "ikhtiyarah";

function App() {
  const [state, setState] = useState<AppState>("welcome");
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResponse | null>(null);
  const [therapistType, setTherapistType] = useState<TherapistType | null>(null);

  const handleStart = () => {
    setState("questionnaire");
  };

  const handleQuestionnaireComplete = (data: QuestionnaireResponse) => {
    setQuestionnaireData(data);
    setState("therapist-selection");
  };

  const handleTherapistSelect = (type: TherapistType) => {
    setTherapistType(type);
    setState("chat");
  };

  const handleBackToQuestionnaire = () => {
    setState("questionnaire");
  };

  const handleIkhtiyarah = () => {
    setState("ikhtiyarah");
  };

  const handleBackToWelcome = () => {
    setState("welcome");
    setQuestionnaireData(null);
    setTherapistType(null);
  };

  const handleEndSession = () => {
    setQuestionnaireData(null);
    setTherapistType(null);
    setState("welcome");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {state === "welcome" && (
          <Welcome onStart={handleStart} onIkhtiyarah={handleIkhtiyarah} />
        )}
        {state === "questionnaire" && (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        )}
        {state === "therapist-selection" && questionnaireData && (
          <TherapistSelection
            onSelect={handleTherapistSelect}
            onBack={handleBackToQuestionnaire}
          />
        )}
        {state === "chat" && questionnaireData && therapistType && (
          <Chat
            questionnaireData={questionnaireData}
            therapistType={therapistType}
            onEndSession={handleEndSession}
          />
        )}
        {state === "ikhtiyarah" && (
          <Shuurok onBack={handleBackToWelcome} />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import Chatbot from "@/components/features/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Brain,
  Shield,
  Sparkles,
  MessageSquare,
  Zap,
  CheckCircle2,
} from "lucide-react";

const ChatbotPage = () => {
  const features = [
    {
      icon: Brain,
      title: "Mock Interviews",
      description:
        "Five structured questions per role with instant keyword-based feedback after every answer.",
    },
    {
      icon: Sparkles,
      title: "Resume Tips",
      description:
        "Paste one bullet — get a 5-point score, what's working, what to improve, and a rewritten version.",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description:
        "Paste any listing text and I'll score it on a 0–100 trust scale with red-flag analysis.",
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description:
        "Ask anything about the platform, applications, or how verification works.",
    },
  ];

  const handleCommonQuestion = (question: string) => {
    // The Chatbot component listens for this custom event and dispatches the
    // prompt as a normal user message, including the bot's reply.
    window.dispatchEvent(
      new CustomEvent("internguard:chat-prompt", { detail: question }),
    );
  };

  const capabilityList = [
    "5-question mock interview for Frontend, Backend, Data, Product, Design",
    "Per-answer feedback with strengths + improvements",
    "Resume bullet scoring out of 5 with a rewrite suggestion",
    "Live listing verification (paste any text, get a 0–100 trust score)",
    "Voice input via Web Speech API on supported browsers",
    "Read-aloud playback for every bot response",
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Career Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personal AI assistant for mock interviews, resume reviews, and
            real-time internship verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Chatbot />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  What I can do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {capabilityList.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-6">
                <Bot className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Pro Tip</h3>
                <p className="text-sm opacity-90">
                  Start with a mock interview — feedback builds on every answer,
                  so each round makes the next one sharper.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Try a quick prompt</h3>
                    <Badge variant="outline">Click to send</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      "How do I prepare for a technical interview?",
                      "What should I include in my resume?",
                      "How can I verify if an internship is legitimate?",
                      "What are red flags in job postings?",
                    ].map((q) => (
                      <Button
                        key={q}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto whitespace-normal py-2"
                        onClick={() => handleCommonQuestion(q)}
                      >
                        “{q}”
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
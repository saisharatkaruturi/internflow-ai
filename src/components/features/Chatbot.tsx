import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  User,
  BrainCircuit,
  Shield,
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildGreetingMessage,
  buildInterviewStartMessage,
  generateReply,
  matchRole,
  MODE_LABEL,
  ChatMessage,
  ConversationContext,
  InterviewRole,
  Mode,
  ROLE_OPTIONS,
  reviewResumeBullet,
} from "@/lib/chatbot-brain";

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    text: "Hi! I'm InternGuard AI. I can run a full mock interview with feedback, review your resume bullet by bullet, or help you verify a suspicious listing. What would you like to do?",
    sender: "bot",
    timestamp: new Date(),
    type: "support",
    kind: "text",
  },
];

/** Minimal shape of the cross-browser Web Speech API we use. */
interface SpeechRecognitionLike extends EventTarget {
  start(): void;
  stop(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const getSpeechRecognition = (): (new () => SpeechRecognitionLike) | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/**
 * Render a bot message. Plain text uses whitespace-pre-line so the
 * `**bold**` markdown hints survive; structured kinds get tailored chrome.
 */
const BotBubble = ({ message }: { message: ChatMessage }) => {
  const text = message.text;

  if (message.kind === "resume-review" && message.meta) {
    const score = (message.meta.score as number | undefined) ?? 0;
    const tone =
      score >= 4
        ? "bg-success/10 text-success border-success/30"
        : score === 3
          ? "bg-warning/10 text-warning border-warning/30"
          : "bg-destructive/10 text-destructive border-destructive/30";
    return (
      <div className={cn("rounded-lg border p-3 text-sm space-y-1", tone)}>
        <div className="font-semibold">Resume review · {score}/5</div>
        <MessageText text={text} />
      </div>
    );
  }

  if (message.kind === "verification" && message.meta) {
    const verdict = message.meta.verdict as string | undefined;
    const icon =
      verdict === "verified" ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : verdict === "caution" ? (
        <AlertTriangle className="h-4 w-4 text-warning" />
      ) : (
        <XCircle className="h-4 w-4 text-destructive" />
      );
    return (
      <div className="rounded-lg border bg-card p-3 text-sm space-y-1">
        <div className="flex items-center gap-2 font-semibold">
          {icon} Verification report
        </div>
        <MessageText text={text} />
      </div>
    );
  }

  if (message.kind === "interview-q") {
    return (
      <div className="rounded-lg border bg-card p-3 text-sm space-y-2">
        <Badge variant="secondary" className="gap-1">
          <BrainCircuit className="h-3 w-3" />
          Interview question
        </Badge>
        <MessageText text={text} />
      </div>
    );
  }

  if (message.kind === "interview-feedback" && message.meta) {
    const score = message.meta.score as number | undefined;
    return (
      <div className="rounded-lg border bg-card p-3 text-sm space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Interview feedback</Badge>
          <span className="text-xs text-muted-foreground">{score}/5</span>
        </div>
        <MessageText text={text} />
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-3 text-sm">
      <MessageText text={text} />
    </div>
  );
};

const MessageText = ({ text }: { text: string }) => (
  <p className="leading-relaxed whitespace-pre-line">
    {text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    })}
  </p>
);

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>("support");
  const [thinking, setThinking] = useState(false);

  // Conversation state for the structured flows.
  const [interviewRole, setInterviewRole] = useState<InterviewRole | null>(null);
  const [interviewIndex, setInterviewIndex] = useState<number | null>(null);

  // Refs to keep long-lived callbacks in sync with the latest state.
  const inputRef = useRef(inputMessage);
  const modeRef = useRef(selectedMode);
  const roleRef = useRef(interviewRole);
  const indexRef = useRef(interviewIndex);
  const messagesRef = useRef(messages);

  useEffect(() => {
    inputRef.current = inputMessage;
  }, [inputMessage]);
  useEffect(() => {
    modeRef.current = selectedMode;
  }, [selectedMode]);
  useEffect(() => {
    roleRef.current = interviewRole;
  }, [interviewRole]);
  useEffect(() => {
    indexRef.current = interviewIndex;
  }, [interviewIndex]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ""));
      u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch {
      /* speech synthesis is best-effort */
    }
  }, []);

  const sendCore = useCallback(
    (rawText: string, forcedMode?: Mode, opts?: { silent?: boolean }) => {
      const text = rawText.trim();
      if (!text) return;
      const mode = forcedMode ?? modeRef.current;

      if (!opts?.silent) {
        const userMsg: ChatMessage = {
          id: generateId(),
          text,
          sender: "user",
          timestamp: new Date(),
          type: mode,
          kind: "text",
        };
        setMessages((prev) => [...prev, userMsg]);
      }
      setInputMessage("");
      setThinking(true);

      window.setTimeout(() => {
        const context: ConversationContext = {
          interviewRole: roleRef.current,
          interviewIndex: indexRef.current,
          setInterviewRole: (r) => setInterviewRole(r),
          setInterviewIndex: (i) => setInterviewIndex(i),
        };
        const reply = generateReply(text, mode, context);
        setMessages((prev) => [...prev, reply]);
        setThinking(false);
      }, 550);
    },
    [],
  );

  const handleSend = () => sendCore(inputRef.current);
  const handleReset = () => {
    setMessages([STARTER_MESSAGES[0]]);
    setInputMessage("");
    setThinking(false);
    setInterviewRole(null);
    setInterviewIndex(null);
  };

  // Global chat-prompt listener used by ChatbotPage's quick questions.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.trim()) {
        sendCore(detail);
      }
    };
    window.addEventListener("internguard:chat-prompt", handler);
    return () => window.removeEventListener("internguard:chat-prompt", handler);
  }, [sendCore]);

  // Voice input — uses Web Speech API when available, falls back to a simulated
  // prompt so the UI is always interactive.
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      return;
    }
    const SR = getSpeechRecognition();
    if (!SR) {
      // Fallback — pre-fill an example prompt so the user can still experience the flow.
      setInputMessage(
        "I led a team of 4 to build a React dashboard that reduced support tickets by 30%.",
      );
      setIsRecording(true);
      window.setTimeout(() => setIsRecording(false), 1200);
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    rec.onerror = () => stopRecording();
    rec.onend = () => setIsRecording(false);
    try {
      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  }, [isRecording, stopRecording]);

  // Quick actions — start each flow properly.
  const startInterview = useCallback(() => {
    setSelectedMode("interview");
    modeRef.current = "interview";
    const role: InterviewRole = "frontend";
    setInterviewRole(role);
    setInterviewIndex(1);
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        text: "Starting your mock interview. I've picked Frontend Engineer — type 'backend', 'data science', 'product', or 'design' to switch roles before answering.",
        sender: "bot",
        timestamp: new Date(),
        type: "interview",
        kind: "text",
      },
      buildInterviewStartMessage(role),
    ]);
  }, []);

  const startResumeReview = useCallback(() => {
    setSelectedMode("advice");
    modeRef.current = "advice";
    setMessages((prev) => [
      ...prev,
      buildGreetingMessage("advice"),
    ]);
  }, []);

  const startVerification = useCallback(() => {
    setSelectedMode("support");
    modeRef.current = "support";
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        text: "Verification mode — paste the full listing text (or the recruiter's email + job description) and I'll score it on a 0–100 trust scale with red-flag analysis.",
        sender: "bot",
        timestamp: new Date(),
        type: "support",
        kind: "text",
      },
    ]);
  }, []);

  // Suggested prompts tailored to the current mode.
  const suggestionsByMode: Record<Mode, string[]> = {
    interview: [
      "Frontend",
      "Backend",
      "Data Science",
      "Product",
      "Design",
    ],
    advice: [
      "Worked on the dashboard page",
      "Responsible for marketing campaigns",
      "Helped the team ship features faster",
    ],
    support: [
      "How do I verify a listing?",
      "Red flags in job postings?",
      "How do applications get tracked?",
    ],
  };

  const lastBot = messagesRef.current.filter((m) => m.sender === "bot").slice(-1)[0];

  const quickActions: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }[] = [
    { label: "Start Mock Interview", icon: BrainCircuit, onClick: startInterview },
    { label: "Resume Tips", icon: Sparkles, onClick: startResumeReview },
    { label: "Verify a Listing", icon: Shield, onClick: startVerification },
  ];

  const placeholder =
    selectedMode === "interview"
      ? interviewRole
        ? `Answer question ${(interviewIndex ?? 1)} of 5…`
        : "Pick a role (frontend / backend / data / product / design)…"
      : selectedMode === "advice"
        ? "Paste a resume bullet to review…"
        : "Paste a listing or ask about the platform…";

  const trimmed = inputMessage.trim();

  // Tiny live hint for resume mode — show what the last paste scored.
  const liveResumeHint =
    selectedMode === "advice" && trimmed.length >= 10
      ? reviewResumeBullet(trimmed)
      : null;

  return (
    <Card className="h-[640px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Assistant</span>
            {interviewRole && selectedMode === "interview" && (
              <Badge variant="secondary" className="ml-2">
                {MODE_LABEL.interview} · Q{(interviewIndex ?? 1)}/5
              </Badge>
            )}
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["interview", "support", "advice"] as Mode[]).map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setSelectedMode(mode);
                  setInterviewRole(null);
                  setInterviewIndex(null);
                  setMessages((prev) => [...prev, buildGreetingMessage(mode)]);
                }}
                className="capitalize"
              >
                {mode === "interview" && <BrainCircuit className="h-4 w-4 mr-1" />}
                {mode === "support" && <Shield className="h-4 w-4 mr-1" />}
                {mode === "advice" && <Sparkles className="h-4 w-4 mr-1" />}
                {MODE_LABEL[mode]}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              title="Restart conversation"
              aria-label="Restart conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div ref={viewportRef} className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={cn("max-w-[78%]", message.sender === "user" && "flex flex-col items-end")}>
                  {message.sender === "user" ? (
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm whitespace-pre-line">
                      {message.text}
                    </div>
                  ) : (
                    <BotBubble message={message} />
                  )}
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.sender === "bot" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 mt-1 text-[10px]"
                      onClick={() => speak(message.text)}
                      aria-label="Read aloud"
                    >
                      <Volume2 className="h-3 w-3 mr-1" /> Read aloud
                    </Button>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
                InternGuard AI is typing…
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length <= 1 && !thinking && (
          <div className="p-4 border-t space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={action.onClick}
                    className="text-xs"
                  >
                    <action.icon className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Or try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionsByMode[selectedMode].map((s) => (
                  <Button
                    key={s}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => {
                      // For role names in interview mode, set the role then start.
                      if (selectedMode === "interview") {
                        const role = matchRole(s);
                        if (role) {
                          setInterviewRole(role);
                          setInterviewIndex(1);
                          setMessages((prev) => [
                            ...prev,
                            buildInterviewStartMessage(role),
                          ]);
                          return;
                        }
                      }
                      sendCore(s);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMode === "interview" && interviewRole && (
          <div className="px-4 py-2 border-t bg-muted/40">
            <p className="text-xs text-muted-foreground mb-2">
              Or switch roles mid-interview:
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((r) => (
                <Button
                  key={r.value}
                  variant={interviewRole === r.value ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    setInterviewRole(r.value);
                    setInterviewIndex(1);
                    setMessages((prev) => [
                      ...prev,
                      buildInterviewStartMessage(r.value),
                    ]);
                  }}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {liveResumeHint && (
          <div
            className={cn(
              "mx-4 mt-2 rounded-md border p-2 text-xs",
              liveResumeHint.score >= 4
                ? "bg-success/10 border-success/30 text-success-foreground"
                : liveResumeHint.score === 3
                  ? "bg-warning/10 border-warning/30"
                  : "bg-destructive/10 border-destructive/30",
            )}
          >
            <span className="font-semibold">Live preview:</span>{" "}
            {liveResumeHint.score}/5 —{" "}
            {liveResumeHint.strengths[0] ??
              liveResumeHint.improvements[0] ??
              "Press send to get full feedback."}
          </div>
        )}

        <div className="p-4 border-t">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={placeholder}
              className="flex-1"
              disabled={thinking}
            />
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="submit"
              variant="hero"
              size="icon"
              disabled={!trimmed || thinking}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Press <kbd className="rounded border px-1">Enter</kbd> to send,{" "}
            <kbd className="rounded border px-1">Shift</kbd>+
            <kbd className="rounded border px-1">Enter</kbd> for a new line.
            {lastBot?.kind === "interview-q" && " Tip: aim for 3–5 sentences per answer."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
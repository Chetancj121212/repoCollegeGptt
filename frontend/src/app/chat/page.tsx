"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, GraduationCap, MessageCircle } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function ChatPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<
    { role: string; content: string; timestamp: Date }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get authentication token
      const token = await getToken();

      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          question: input,
          user_id: user?.id,
          user_name: user?.fullName || user?.firstName,
        }),
      });

      const data = await res.json();
      const botMessage = {
        role: "bot",
        content:
          data.answer || "Sorry, I couldn't process your request right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: "bot",
        content:
          "Sorry, I'm having trouble connecting. Please make sure the backend server is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <Card className="mb-4 border-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    CollegeGPT
                  </CardTitle>
                  <p className="text-sm text-white/80">
                    {user
                      ? `Welcome back, ${user.firstName || "there"}!`
                      : "Your AI assistant for college information"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {messages.length} messages
                </Badge>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <ScrollArea
              className="h-[calc(100vh-280px)] p-4"
              ref={scrollAreaRef}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full shadow-lg">
                    <Bot className="h-12 w-12 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Welcome to CollegeGPT! 🎓
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Ask me anything about college - admissions, costs, majors,
                      campus life, and more!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border-purple-200 text-purple-700 hover:border-purple-300 transition-all duration-200"
                      onClick={() =>
                        setInput("What are the benefits of going to college?")
                      }
                    >
                      Benefits of college
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-blue-200 text-blue-700 hover:border-blue-300 transition-all duration-200"
                      onClick={() => setInput("How much does college cost?")}
                    >
                      College costs
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 border-cyan-200 text-cyan-700 hover:border-cyan-300 transition-all duration-200"
                      onClick={() => setInput("What majors are available?")}
                    >
                      Available majors
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start space-x-3 ${
                        msg.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar
                        className={
                          msg.role === "user"
                            ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg"
                            : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg"
                        }
                      >
                        <AvatarFallback>
                          {msg.role === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg shadow-lg ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-br-none"
                              : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${
                            msg.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="bg-gradient-to-br from-stone-600 to-neutral-600 shadow-lg">
                        <AvatarFallback>
                          <Bot className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-br from-slate-700 to-zinc-700 border border-slate-600 rounded-lg rounded-bl-none shadow-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-slate-400 to-zinc-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gradient-to-r from-zinc-400 to-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gradient-to-r from-gray-400 to-stone-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <Separator />

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about college..."
                className="flex-1 border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200 transition-all duration-200"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

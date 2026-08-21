import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { InteractiveDeckViewer } from "./components/InteractiveDeckViewer";
import { TdmCalculator } from "./components/TdmCalculator";
import { InteractionChecker } from "./components/InteractionChecker";
import { AuditDashboard } from "./components/AuditDashboard";
import { AntifungalReference } from "./components/AntifungalReference";
import { InstitutionalConfigModal } from "./components/InstitutionalConfigModal";
import { ChatMessage, StewardshipMode, InstitutionalConfig } from "./types";
import { DEFAULT_INSTITUTIONAL_CONFIG } from "./data/modes";

export function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "tdm" | "interactions" | "audit" | "reference" | "deck">("chat");
  const [selectedMode, setSelectedMode] = useState<StewardshipMode>("/case");
  const [searchGrounding, setSearchGrounding] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDeckMarkdown, setActiveDeckMarkdown] = useState<string>("");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [institutionalConfig, setInstitutionalConfig] = useState<InstitutionalConfig>(() => {
    const saved = localStorage.getItem("fungi_institutional_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_INSTITUTIONAL_CONFIG;
      }
    }
    return DEFAULT_INSTITUTIONAL_CONFIG;
  });

  const handleSaveConfig = (newConfig: InstitutionalConfig) => {
    setInstitutionalConfig(newConfig);
    localStorage.setItem("fungi_institutional_config", JSON.stringify(newConfig));
  };

  const handleSendMessage = async (content: string, modeOverride?: StewardshipMode) => {
    const modeToUse = modeOverride || selectedMode;

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content,
      mode: modeToUse,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantPlaceholderId = "assistant-" + Date.now();
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      mode: modeToUse,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      // Build conversation payload
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          mode: modeToUse,
          history: historyPayload,
          searchGrounding,
          institutionalConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let groundingSources: any[] = [];

      if (reader) {
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (!dataStr) continue;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedContent += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantPlaceholderId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                }
                if (parsed.groundingMetadata?.webSearchQueries) {
                  // Captured web grounding queries
                }
                if (parsed.groundingMetadata?.groundingChunks) {
                  groundingSources = parsed.groundingMetadata.groundingChunks
                    .filter((c: any) => c.web?.uri)
                    .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
                }
                if (parsed.done) {
                  // Stream complete
                }
              } catch (err) {
                console.error("Error parsing stream chunk", err);
              }
            }
          }
        }
      }

      // Final update to message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content: accumulatedContent || "Assessment complete.",
                groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
              }
            : msg
        )
      );

      // If deck mode, store active deck
      if (modeToUse === "/deck" || accumulatedContent.includes("Slide 1")) {
        setActiveDeckMarkdown(accumulatedContent);
      }
    } catch (error: any) {
      console.error("API error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content: `**Clinical Copilot Service Error**: Unable to complete synthesis. ${error?.message || "Please check server connectivity and try again."}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchDeck = (markdown: string) => {
    setActiveDeckMarkdown(markdown);
    setActiveTab("deck");
  };

  const handleSendToCopilotFromTools = (prompt: string) => {
    setActiveTab("chat");
    handleSendMessage(prompt);
  };

  const handleGenerateDeckFromViewer = (topic: string) => {
    const prompt = `/deck Create a complete 10-slide case-based unfolding teaching deck on: ${topic}. Include learning objectives, host risk, baseline vitals, decision points with audience questions, 48h culture update, susceptibility breakpoints, TDM, source control, pharmacist intervention table, SBAR note, and 5 key take-home messages with evidence citations.`;
    setActiveTab("chat");
    handleSendMessage(prompt, "/deck");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        searchGrounding={searchGrounding}
        setSearchGrounding={setSearchGrounding}
        onOpenSettings={() => setIsConfigModalOpen(true)}
      />

      <main className="min-h-[calc(100vh-65px)]">
        {activeTab === "chat" && (
          <ChatWorkspace
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            searchGrounding={searchGrounding}
            onLaunchDeck={handleLaunchDeck}
            onClearChat={() => setMessages([])}
          />
        )}

        {activeTab === "tdm" && (
          <TdmCalculator onSendToCopilot={handleSendToCopilotFromTools} />
        )}

        {activeTab === "interactions" && <InteractionChecker />}

        {activeTab === "deck" && (
          <InteractiveDeckViewer
            deckMarkdown={activeDeckMarkdown}
            onGenerateNewDeck={handleGenerateDeckFromViewer}
            isLoading={isLoading}
          />
        )}

        {activeTab === "audit" && <AuditDashboard />}

        {activeTab === "reference" && <AntifungalReference />}
      </main>

      {/* Institutional Settings Modal */}
      <InstitutionalConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={institutionalConfig}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
export default App;

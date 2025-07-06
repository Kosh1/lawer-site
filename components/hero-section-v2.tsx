"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChatDialog } from "@/components/chat-dialog";
import type { LandingConfig } from "@/lib/landingConfigs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HeroSectionV2Props {
  config: LandingConfig & { examplePdf?: string };
}

export default function HeroSectionV2({ config }: HeroSectionV2Props) {
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const exampleRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Анимация счетчика до 143
  useEffect(() => {
    if (counter < 143) {
      const timer = setTimeout(() => setCounter(counter + 1), 15);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  useEffect(() => {
    if (exampleRef.current) {
      setIsOverflowing(exampleRef.current.scrollHeight > exampleRef.current.clientHeight);
    }
  }, [config.example]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsChatOpen(true);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20 border-b mt-0">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start gap-10 md:gap-16">
        {/* Левая часть: текст и форма */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight text-left">
            {config.title}
          </h1>
          <p className="text-sm md:text-base font-semibold text-blue-600">
            {config.subtitle}
          </p>
          <form className="w-full flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
            <textarea
              className="w-full h-16 md:h-24 border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder={config.placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 rounded-lg text-sm md:text-lg shadow-md transition disabled:opacity-50"
              disabled={!input.trim()}
            >
              {config.ctaButton}
            </button>
            {/* Бейджи под кнопкой */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border border-gray-200">
                <span role="img" aria-label="lock">🔒</span> 100% конфиденциально
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border border-gray-200">
                <span role="img" aria-label="money">💸</span> Бесплатно
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border border-gray-200">
                <span role="img" aria-label="clock">⏱️</span> За две минуты
              </span>
            </div>
          </form>
        </div>
        {/* Правая часть: сверстанный пример документа */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full max-w-xl min-w-[400px] bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="text-xs text-gray-400 text-center mb-2">Пример готового документа</div>
            {config.examplePdf ? (
              <>
                <div className="w-full h-48 md:h-80 flex items-center justify-center bg-white border border-dashed border-gray-300 rounded mb-2">
                  <span className="text-xs text-gray-500">PDF-пример документа</span>
                </div>
                <button
                  className="mt-2 text-blue-600 hover:underline text-xs font-semibold"
                  onClick={() => setShowExampleModal(true)}
                >
                  Показать полностью
                </button>
                <Dialog open={showExampleModal} onOpenChange={setShowExampleModal}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Полный пример документа</DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-[70vh]">
                      <iframe
                        src="/examples/example.pdf"
                        className="w-full h-full rounded"
                        title="Пример документа"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
                <div
                  ref={exampleRef}
                  className="text-left text-xs md:text-sm font-mono text-gray-700 leading-relaxed whitespace-pre-line relative max-h-80 overflow-hidden"
                >
                  {config.example}
                  {isOverflowing && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  )}
                </div>
                {isOverflowing && (
                  <button
                    className="mt-2 text-blue-600 hover:underline text-xs font-semibold"
                    onClick={() => setShowExampleModal(true)}
                  >
                    Показать полностью
                  </button>
                )}
                <Dialog open={showExampleModal} onOpenChange={setShowExampleModal}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Полный пример документа</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto text-xs md:text-sm font-mono text-gray-700 leading-relaxed whitespace-pre-line">
                      {config.example}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
      {/* ChatDialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={input}
      />
    </section>
  );
} 
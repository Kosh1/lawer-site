"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChatDialog } from "@/components/chat-dialog";

export default function HeroSectionV2() {
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [counter, setCounter] = useState(0);

  // Анимация счетчика до 143
  useEffect(() => {
    if (counter < 143) {
      const timer = setTimeout(() => setCounter(counter + 1), 15);
      return () => clearTimeout(timer);
    }
  }, [counter]);

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
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight text-left">
            Не дают видеться с ребенком?
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-pink-600">
            Получите готовое исковое заявление бесплатно
          </p>
          <p className="text-gray-600 text-base md:text-lg">
            Опишите свою ситуацию — получите документ, который поможет восстановить ваши права.
          </p>
          <form className="w-full flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
            <textarea
              className="w-full h-20 md:h-24 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Бывшая жена не дает видеться с сыном уже два месяца..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow-md transition disabled:opacity-50"
              disabled={!input.trim()}
            >
              Составить исковое заявление
            </button>
            {/* Бейджи под кнопкой */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                <span role="img" aria-label="lock">🔒</span> 100% конфиденциально
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                <span role="img" aria-label="money">💸</span> Бесплатно
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                <span role="img" aria-label="clock">⏱️</span> За две минуты
              </span>
            </div>
          </form>
          {/* Счетчик */}
          <div className="mt-6 text-gray-700 text-sm font-medium">
            <span className="text-2xl font-bold text-pink-600">{counter}</span> человек воспользовались сегодня
          </div>
        </div>
        {/* Правая часть: сверстанный пример документа */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full max-w-xl min-w-[400px] bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="text-xs text-gray-400 text-center mb-2">Пример готового документа</div>
            <div className="text-left text-xs md:text-sm font-mono text-gray-700 leading-relaxed whitespace-pre-line">
{`В ____________________ суд
от: Иванова Ивана Ивановича
адрес: 123456, г. Москва, ул. Примерная, д. 1, кв. 1

Ответчик: Петрова Мария Сергеевна
адрес: 123456, г. Москва, ул. Примерная, д. 2, кв. 2

ИСКОВОЕ ЗАЯВЛЕНИЕ
о порядке общения с ребенком

С 01.01.2023 года ответчик препятствует моему общению с сыном Ивановым Петром Ивановичем, 2015 г.р., не дает видеться и участвовать в воспитании.

На основании ст. 66 СК РФ прошу:
1. Установить порядок общения с ребенком: каждую субботу с 10:00 до 18:00, а также половину всех школьных каникул.
2. Обязать ответчика не препятствовать моему общению с сыном.

Приложения:
1. Копия свидетельства о рождении ребенка
2. Копия паспорта истца

Дата: ____________    Подпись: ____________`}
            </div>
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
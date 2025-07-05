import React from "react";
import Image from "next/image";

export default function HeroSectionV2() {
  return (
    <section className="w-full bg-white py-12 md:py-20 border-b">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Левая часть: текст и форма */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Не дают видеться с ребенком?
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-pink-600">
            Получите готовое исковое заявление бесплатно
          </p>
          <p className="text-gray-600 text-base md:text-lg">
            Опишите свою ситуацию — получите документ, который поможет восстановить ваши права.
          </p>
          <form className="w-full flex flex-col gap-4 mt-2">
            <textarea
              className="w-full h-20 md:h-24 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Бывшая жена не дает видеться с сыном уже два месяца..."
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow-md transition"
            >
              Составить исковое заявление
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span role="img" aria-label="lock">🔒</span> 100% конфиденциально
            </div>
          </form>
          {/* Блок доверия */}
          <div className="flex items-center gap-4 mt-4">
            {/* Фото пользователей */}
            <div className="flex -space-x-2">
              <Image src="/placeholder-user.jpg" alt="user1" width={40} height={40} className="rounded-full border-2 border-white" />
              <Image src="/placeholder-user.jpg" alt="user2" width={40} height={40} className="rounded-full border-2 border-white" />
              <Image src="/placeholder-user.jpg" alt="user3" width={40} height={40} className="rounded-full border-2 border-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              15 000 отцов уже воспользовались
            </span>
            {/* Бейдж юриста */}
            <div className="flex items-center gap-1 ml-4 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              <Image src="/placeholder-user.jpg" alt="lawyer" width={24} height={24} className="rounded-full" />
              <span className="text-xs text-green-700 font-semibold">Проверено юристом</span>
            </div>
          </div>
        </div>
        {/* Правая часть: превью документа */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
            <Image
              src="/placeholder.jpg"
              alt="Превью искового заявления"
              width={400}
              height={500}
              className="rounded-lg object-contain"
            />
            <div className="text-xs text-gray-400 text-center mt-2">Пример готового документа</div>
          </div>
        </div>
      </div>
    </section>
  );
} 
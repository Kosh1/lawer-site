import React from "react";

export function ComparisonSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          ИИ-консультант vs Обычный юрист
        </h2>
        <p className="text-lg text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          Почему тысячи семей выбирают ИИ для защиты своих прав на имущество
        </p>
        <div className="overflow-x-auto">
          <table className="w-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-400 to-purple-400">
            <thead>
              <tr>
                <th className="text-white text-lg font-semibold py-5 px-4 text-center" colSpan={3}>
                  Выберите лучший способ защитить свои права
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/90 divide-y divide-gray-200 text-center">
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">Стоимость</td>
                <td className="py-4 px-4 text-gray-700">от 5,000₽</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">БЕСПЛАТНО</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">Время ответа</td>
                <td className="py-4 px-4 text-gray-700">3-7 дней</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">2 минуты</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">Знание цен на имущество</td>
                <td className="py-4 px-4 text-gray-700">примерное</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">актуальные данные</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">Объективность</td>
                <td className="py-4 px-4 text-gray-700">может продавать услуги</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">только ваши интересы</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">База решений</td>
                <td className="py-4 px-4 text-gray-700">личный опыт</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">10,000+ дел</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-700">Доступность</td>
                <td className="py-4 px-4 text-gray-700">рабочие часы</td>
                <td className="py-4 px-4 text-indigo-600 font-bold">24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
} 
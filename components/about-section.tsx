"use client"

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">О сервисе ИскИИ</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          ИскИИ — это бесплатный онлайн-сервис для автоматического создания исковых заявлений с помощью искусственного интеллекта. Мы помогаем людям защищать свои права без затрат на юристов и сложные формальности.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <div className="text-2xl font-bold text-blue-600 mb-2">15,000+</div>
            <div className="text-gray-600 dark:text-gray-300">созданных документов</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <div className="text-2xl font-bold text-purple-600 mb-2">100% бесплатно</div>
            <div className="text-gray-600 dark:text-gray-300">без скрытых платежей</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <div className="text-2xl font-bold text-green-600 mb-2">Проверено юристами</div>
            <div className="text-gray-600 dark:text-gray-300">документы соответствуют закону</div>
          </div>
        </div>
      </div>
    </section>
  )
} 
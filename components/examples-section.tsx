"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, User, FileText } from "lucide-react"

export function ExamplesSection() {
  const [currentExample, setCurrentExample] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const examples = [
    {
      id: 1,
      title: "Алименты на ребенка",
      tag: "#Алименты",
      userInput:
        "Развожусь с мужем. Ребенку 5 лет. Муж работает менеджером, зарплата 50 тысяч, но предлагает платить только 8 тысяч алиментов. Это несправедливо по отношению к дочери. [👤 Анна, мама]",
      result: {
        court: "Кунцевский районный суд г. Москвы",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "о взыскании алиментов на несовершеннолетнего ребёнка",
        preview: `Я, [Ваше ФИО], состою в браке с [ФИО мужа] (брак зарегистрирован [дата], свидетельство № [номер]). От брака имеется несовершеннолетняя дочь, [ФИО ребёнка], [дата рождения].
  
  Ответчик предлагает выплачивать алименты в размере 8 000 ₽, что составляет всего 16% от его официального дохода (50 000 ₽). Согласно ст. 81 Семейного кодекса РФ, на одного ребёнка положено 25% заработка.
  
  Прошу суд:
  
  Взыскать с [ФИО мужа] алименты в размере 25% от его ежемесячного дохода (12 500 ₽) на содержание [ФИО ребёнка].
  
  Запросить у работодателя ответчика справку 2-НДФЛ для подтверждения его доходов.`,
      },
    },
    
    {
      id: 2,
      title: "Развод с разделом имущества",
      tag: "#Разводсразделом",
      userInput:
        "Жена подала на развод и хочет забрать квартиру и машину, хотя я все это покупал. У нас двое детей. В Тверской районный Хочу справедливо разделить имущество и установить алименты.",
      result: {
        court: "Пресненский районный суд г. Москвы",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "о разделе совместно нажитого имущества и установлении алиментов",
        preview: `Я, [Ваше ФИО], и [ФИО супруги] состояли в браке с [дата] по [дата]. Имеем двоих детей: [ФИО, даты рождения]. В период брака было приобретено:

Квартира по адресу: _______, куплена в [год], оформлена на [кого];

Автомобиль [марка], куплен в [год], оформлен на [кого].

Ответчик требует передать ей всё имущество, однако:

Квартира куплена на средства от продажи моей квартиры, полученной до брака (приложение: выписка из Росреестра);

Автомобиль приобретён на мои сбережения (приложение: выписка по счёту).

Дети проживают с супругой, но я готов участвовать в их содержании. Мой доход: _____ руб., доход супруги: _____ руб.

Прошу:

Разделить имущество:

Квартиру в соотношении [указать желаемые доли, например 70/30];

Автомобиль передать мне.

Установить алименты в размере 1/3 дохода на содержание детей.

Приложения:

Копии свидетельств о браке и рождении детей;

Документы на имущество;

Справки о доходах;

Иные доказательства (указать какие).`,
      },
    },
    {
      id: 3,
      title: "Увеличение алиментов",
      tag: "#Алименты",
      userInput:
        "Бывший муж платит алименты 10 тысяч уже 3 года. За это время его зарплата выросла до 120 тысяч,а ребенку нужно больше денег на учебу и развитие",
      result: {
        court: "Мировой суд судебного участка №123",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "об увеличении размера алиментов на несовершеннолетнего ребенка",
        preview: `Я, [Ваше ФИО], являюсь матерью несовершеннолетнего [ФИО ребенка, дата рождения], что подтверждается свидетельством о рождении [реквизиты].

С [дата] по [дата] состояла в браке с ответчиком, что подтверждается свидетельством о браке [реквизиты]/свидетельством о расторжении брака [реквизиты].

Согласно [судебному приказу/решению суда/нотариальному соглашению] от [дата], ответчик обязан выплачивать алименты в размере 10 000 рублей ежемесячно.

Изменение обстоятельств:

Доходы ответчика значительно увеличились и составляют не менее 120 000 рублей ежемесячно (указать источник информации, если есть).

Потребности ребенка возросли в связи с:

необходимостью оплаты дополнительного образования (репетиторы, кружки);

расходами на развивающие занятия;

увеличением стоимости жизни (привести конкретные примеры).

Требования:
На основании ст. 119 СК РФ, прошу:

Увеличить размер алиментов до 1/4 (25%) от всех видов заработка ответчика.

Взыскать дополнительные расходы на ребенка в размере [сумма] ежемесячно (при наличии подтверждающих документов).

Взыскать с ответчика расходы по уплате госпошлины.

Приложение:

Копия свидетельства о рождении ребенка.

Копия свидетельства о браке/разводе.

Копия предыдущего решения суда/соглашения об алиментах.

Доказательства увеличения доходов ответчика.

Документы, подтверждающие дополнительные расходы на ребенка.

Расчет алиментов.

Квитанция об уплате госпошлины.

Копия искового заявления для ответчика.

Дата: __________ Подпись: __________

`,
      },
    },
  ]

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length)
  }

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length)
  }

  const example = examples[currentExample]

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="examples"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Смотрите, как просто</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Реальные примеры того, как обычное описание превращается в юридический документ
          </p>
        </div>

        <div className="relative">
          {/* Навигация */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" size="icon" onClick={prevExample} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExample(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentExample ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextExample} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Пример */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Что написал пользователь */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Что написал пользователь</h3>
                </div>
                <Badge variant="secondary" className="mb-4">
                  {example.tag}
                </Badge>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed italic">"{example.userInput}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Что получил */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Что получил</h3>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-inner">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 mb-2">{example.result.court}</div>
                    <h4 className="text-lg font-bold text-gray-900">{example.result.title}</h4>
                    <div className="text-sm text-gray-600">{example.result.subtitle}</div>
                  </div>
                  <div className="border-t pt-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{example.result.preview}</pre>
                    <div className="text-center mt-4">
                      <Button variant="outline" size="sm">
                        Смотреть полный документ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Заголовок примера */}
          <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-gray-900">{example.title}</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

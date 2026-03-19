# MY-UI: SwiftUI-inspired React Framework 🚀

Этот проект представляет собой кастомный декларативный UI-фреймворк для React, написанный на TypeScript, вдохновленный концепциями Apple SwiftUI. 

Вместо традиционной верстки на основе тегов и CSS-классов, проект предлагает объектно-ориентированный подход с цепочками модификаторов. В качестве демонстрации возможностей фреймворка реализован стандартный калькулятор iOS (app/page.tsx).

## ✨ Ключевые особенности

* Декларативный синтаксис: Настройка компонентов через чейнинг методов, таких как .padding(), .background(), .clipShape(), .frame().
* Стеки компоновки: Привычные для iOS-разработчиков MYHStack, MYVStack и MYZStack для интуитивного выравнивания элементов.
* Базовые компоненты: Строго типизированные MYText, MYButton, MYColor, MYAnyView.
* Геометрия и формы: Встроенные MYRoundedRectangle (с поддержкой сглаживания continuous corners), MYCapsule, MYCircle.
* Система модификаторов: Поддержка offset, opacity, scaleEffect, а также хуков жизненного цикла (onAppear, onDisappear, onChange).
* Анимации: Удобная обертка для CSS-транзишенов через метод .animation().

## 🛠 Стек технологий

* Ядро: React
* Фреймворк: Next.js (App Router)
* Язык: TypeScript
* Стилизация: Инлайн-стили генерацией через модификаторы и хуки (без внешних CSS-файлов).

## 📱 Демонстрация: iOS Calculator

Точкой входа (app/page.tsx) служит приложение калькулятора. Оно демонстрирует:
- Работу сложной стейт-логики математических операций.
- Рендеринг вложенных стеков (VStack внутри HStack и т.д.).
- Динамическое изменение стилей (например, подсветка активного оператора).
- Анимации нажатия на кастомные кнопки.

## 🚀 Быстрый старт

Установите зависимости и запустите локальный сервер разработки:

    npm install
    npm run dev

Откройте http://localhost:3000 в браузере, чтобы увидеть результат.

## 📖 Пример использования MY-UI

Все UI-элементы наследуются от базового класса MYView. Для рендера дерева компонентов в React используется специальная обертка RenderMYView.

    import { MYVStack, MYText, MYColor, RenderMYView, MYRoundedRectangle } from "@/my-ui";

    const myView = new MYVStack([
      new MYText("Hello World")
        .font(24)
        .foregroundColor("white")
    ])
      .background(MYColor.black)
      .padding(20)
      .clipShape(new MYRoundedRectangle(16));

    export default function App() {
      return <RenderMYView view={myView} />;
    }

## 🤝 Вклад в проект
Если вы хотите расширить библиотеку компонентов, добавьте новый класс в папку my-ui/components или новый модификатор в my-ui/modifiers, унаследовав его от интерфейса MYViewModifier.
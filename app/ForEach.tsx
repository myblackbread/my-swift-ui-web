// import React from "react";
// import { MYView } from "./View";
// import { MYRenderContext } from "../types/RenderContext";
// import { MYFrame, isFlexible } from "../types/Frame";

// export class MYForEach<T> extends MYView {
//     private readonly items: T[];
//     private readonly keyExtractor: (item: T, index: number) => React.Key;
//     private readonly builder: (item: T) => MYView;

//     // 1. Перегрузка: как во фрагменте ForEach(0..<5)
//     constructor(lower: number, upper: number, content: (index: number) => MYView);

//     // 2. Перегрузка: массив + указание поля-ключа (id: \.id) или функции
//     constructor(
//         data: T[],
//         id: keyof T | ((item: T) => React.Key) | "\\.self",
//         content: (item: T, index: number) => MYView
//     );

//     // 3. Перегрузка: массив примитивов без явного ключа
//     constructor(data: T[], content: (item: T) => MYView);

//     // Реализация конструктора
//     constructor(...args: any[]) {
//         super();

//         if (typeof args[0] === "number") {
//             const count = args[0];
//             this.builder = args[1];
//             // Создаем массив чисел от 0 до count - 1
//             this.items = Array.from({ length: count }, (_, i) => i as unknown as T);
//             this.keyExtractor = (_, index) => index;
//         } else if (Array.isArray(args[0])) {
//             this.items = args[0];

//             if (args.length === 2) {
//                 // Вариант без ключа (для примитивов)
//                 this.builder = args[1];
//                 this.keyExtractor = (item, index) => {
//                     return (typeof item === "string" || typeof item === "number") ? String(item) : index;
//                 };
//             } else {
//                 // Вариант с явным ключом
//                 const idProp = args[1];
//                 this.builder = args[2];

//                 this.keyExtractor = (item, index) => {
//                     if (typeof idProp === "function") {
//                         return idProp(item, index);
//                     }
//                     if (idProp === "\\.self") {
//                         return (typeof item === "string" || typeof item === "number") ? String(item) : index;
//                     }
//                     if (item != null && typeof item === "object" && idProp in item) {
//                         return String((item as any)[idProp]);
//                     }
//                     return index; // фоллбэк
//                 };
//             }
//         } else {
//             this.items = [];
//             this.keyExtractor = (_, i) => i;
//             this.builder = () => new MYView.from(null) as any;
//         }
//     }

//     // Важный момент: мы должны пробросить размеры дочерних элементов наверх,
//     // чтобы родительский VStack/HStack знал, нужно ли ему растягиваться (Flexbox)
//     get idealFrame(): MYFrame {
//         let needsFlexWidth = false;
//         let needsFlexHeight = false;

//         for (let i = 0; i < this.items.length; i++) {
//             const childFrame = this.builder(this.items[i], i).idealFrame;
//             if (isFlexible(childFrame.width) || isFlexible(childFrame.maxWidth)) needsFlexWidth = true;
//             if (isFlexible(childFrame.height) || isFlexible(childFrame.maxHeight)) needsFlexHeight = true;
//         }

//         return {
//             ...(needsFlexWidth ? { width: Infinity } : {}),
//             ...(needsFlexHeight ? { height: Infinity } : {})
//         };
//     }

//     body(context?: MYRenderContext): React.ReactNode {
//         return (
//             <>
//                 {this.items.map((item, index) => {
//                     const childView = this.builder(item);
//                     return (
//                         <React.Fragment key={this.keyExtractor(item, index)}>
//                             {childView.body(context)}
//                         </React.Fragment>
//                     );
//                 })}
//             </>
//         );
//     }
// }
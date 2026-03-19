
import React from "react";
import {
  RenderMYView,
  MYText,
  MYColor,
  MYVStack,
  MYHStack,
  MYRoundedRectangle,
  MYAnimations,
  MYButton,
  MYCapsule,
} from "@/my-ui";

export default function CalculatorExample() {
  const [display, setDisplay] = React.useState("0");
  const [firstOperand, setFirstOperand] = React.useState<number | null>(null);
  const [operator, setOperator] = React.useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = React.useState(false);

  const colors = {
    darkGray: MYColor.rgb(51, 51, 51),
    lightGray: MYColor.rgb(165, 165, 165),
    orange: MYColor.rgb(255, 159, 10),
    background: MYColor.black,
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : (display + digit).slice(0, 9));
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator && !waitingForSecondOperand) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const second = parseFloat(display);
    const first = firstOperand ?? 0;
    switch (operator) {
      case "+": return first + second;
      case "-": return first - second;
      case "×": return first * second;
      case "÷": return first / second;
      default: return second;
    }
  };

  const CalcButton = (
    label: string,
    action: () => void,
    color: MYColor = colors.darkGray,
    isDouble: boolean = false,
    isActive: boolean = false
  ) => {
    const textColor = color === colors.lightGray ? "black" : "white";
    const bgColor = isActive ? MYColor.white : color;
    const finalTextColor = isActive ? "rgb(255, 159, 10)" : textColor;

    return new MYButton(
      new MYText(label)
        .foregroundColor(finalTextColor)
        .font(32)
        .fontWeight(400)
        .frame(isDouble ? { maxWidth: Infinity, alignment: "left" } : {})
        .padding(isDouble ? { left: 32 } : 0)
        .frame({
          width: isDouble ? 158 : 74,
          height: 74
        })
        .background(bgColor)
        .clipShape(new MYCapsule()),
      action
    )
      .animation(MYAnimations.easeInOut(0.15));
  };

  const calculatorView = new MYVStack([
    new MYVStack([
      new MYText(display)
        .font(display.length > 7 ? 50 : 70)
        .foregroundColor("white")
        .fontWeight(300)
        .frame({ maxWidth: Infinity, alignment: "right" })
    ])
      .frame({ height: 160, alignment: "bottom" })
      .padding({ edges: "horizontal", length: 30 }),

    new MYVStack([
      new MYHStack([
        CalcButton("AC", () => { setDisplay("0"); setFirstOperand(null); setOperator(null); }, colors.lightGray),
        CalcButton("+/-", () => setDisplay(String(parseFloat(display) * -1)), colors.lightGray),
        CalcButton("%", () => setDisplay(String(parseFloat(display) / 100)), colors.lightGray),
        CalcButton("÷", () => handleOperator("÷"), colors.orange, false, operator === "÷"),
      ], 10),

      new MYHStack([
        CalcButton("7", () => inputDigit("7")),
        CalcButton("8", () => inputDigit("8")),
        CalcButton("9", () => inputDigit("9")),
        CalcButton("×", () => handleOperator("×"), colors.orange, false, operator === "×"),
      ], 10),

      new MYHStack([
        CalcButton("4", () => inputDigit("4")),
        CalcButton("5", () => inputDigit("5")),
        CalcButton("6", () => inputDigit("6")),
        CalcButton("-", () => handleOperator("-"), colors.orange, false, operator === "-"),
      ], 10),

      new MYHStack([
        CalcButton("1", () => inputDigit("1")),
        CalcButton("2", () => inputDigit("2")),
        CalcButton("3", () => inputDigit("3")),
        CalcButton("+", () => handleOperator("+"), colors.orange, false, operator === "+"),
      ], 10),

      new MYHStack([
        CalcButton("0", () => inputDigit("0"), colors.darkGray, true),
        CalcButton(".", () => !display.includes(".") && setDisplay(display + ".")),
        CalcButton("=", () => {
          const res = performCalculation();
          setDisplay(String(res));
          setFirstOperand(null);
          setOperator(null);
        }, colors.orange),
      ], 10),
    ], 10)
  ], 10)
    .padding(20)
    .background(colors.background)
    .clipShape(new MYRoundedRectangle(45));

  return <RenderMYView view={calculatorView} />;
}
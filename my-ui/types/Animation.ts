
export type MYAnimation = {
  duration: number; // в секундах
  timingCurve: string; // "linear", "ease-in-out", "cubic-bezier(...)" и т.д.
};

export const MYAnimations = {
  default: { duration: 0.3, timingCurve: "ease" } as MYAnimation,
  linear: (duration = 0.3): MYAnimation => ({ duration, timingCurve: "linear" }),
  easeInOut: (duration = 0.3): MYAnimation => ({ duration, timingCurve: "ease-in-out" }),
};
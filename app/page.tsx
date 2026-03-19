"use client";
import MusicPlayerExample from "./examples/music-player/page";
import CalculatorExample from "./examples/calculator/page";
import { MYBaseView } from "@/my-ui";

export default function Test() {
  return (
    <MYBaseView dynamicStyle={{
      style: p => ({
        ...p,
        width: "100vw",
        height: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      })
    }}>
      <MusicPlayerExample />
    </MYBaseView>
  );
}
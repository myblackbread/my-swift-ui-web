import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYColorType } from "../types/ColorType";

export class MYText extends MYView {
  private textStyle: React.CSSProperties = {};

  constructor(public readonly text: string) {
    super();
  }

  private cloneWithStyle(style: React.CSSProperties): MYText {
    const newText = new MYText(this.text);
    newText.textStyle = { ...this.textStyle, ...style };
    return newText;
  }

  font(size: number | string): MYText {
    return this.cloneWithStyle({ fontSize: size });
  }

  fontWeight(weight: React.CSSProperties["fontWeight"]): MYText {
    return this.cloneWithStyle({ fontWeight: weight });
  }

  foregroundColor(color: MYColorType): MYText {
    const colorValue = typeof color === "string" ? color : color.rawValue;
    return this.cloneWithStyle({ color: colorValue });
  }

  body(context?: MYRenderContext): React.ReactNode {
    return (
      <MYBaseView
        element="span"
        renderContext={context}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            ...this.textStyle,
            whiteSpace: "pre-wrap",
            pointerEvents: "none",
          })
        }}
      >
        {this.text}
      </MYBaseView>
    );
  }
}
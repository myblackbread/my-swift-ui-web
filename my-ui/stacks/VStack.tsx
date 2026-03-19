import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "../components/BaseView";
import { MYHorizontalAlignment } from "../types/HorizontalAlignment";
import { isFlexible, MYFrame } from "../types/Frame";
import { MYContainerView } from "../core/ContainerView";
import { MYDynamicStyle } from "../types/DynamicStyle";

export class MYVStack extends MYContainerView<"div"> {
    constructor(
        children: MYView[],
        private readonly spacing: number = 8,
        private readonly alignment: MYHorizontalAlignment = "center" // "leading" | "center" | "trailing"
    ) {
        super(children);
    }

    private getAlignItems(): string {
        switch (this.alignment) {
            case "left": return "flex-start";
            case "right": return "flex-end";
            case "center":
            default: return "center";
        }
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        return {
            ...super.getChildWrapperStyle(index),
            display: "contents"
        };
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: (prev) => ({
                ...prev,
                display: "flex",
                flexDirection: "column",
                gap: this.spacing,
                alignItems: this.getAlignItems()
            })
        };
    }
}
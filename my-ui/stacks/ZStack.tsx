import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "../components/BaseView";
import { MYAlignment, AlignmentMap } from "../types/Alignment";
import { isFlexible, MYFrame } from "../types/Frame";
import { MYContainerView } from "../core/ContainerView";
import { MYDynamicStyle } from "../types/DynamicStyle";

export class MYZStack extends MYContainerView<"div"> {
    constructor(
        children: MYView[],
        private readonly alignment: MYAlignment = "center"
    ) {
        super(children);
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: (prev) => ({
                ...prev,
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr",
            })
        };
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        const alignStyles = AlignmentMap[this.alignment] || AlignmentMap.center;

        return {
            ...super.getChildWrapperStyle(index),
            gridColumn: 1,
            gridRow: 1,
            ...alignStyles
        };
    }
}
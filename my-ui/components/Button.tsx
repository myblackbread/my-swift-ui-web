import React, { useState, useRef } from "react";
import { MYView, MYAnyView } from "../core/View";
import { MYRenderContext } from "../types/RenderContext";
import { MYBaseView } from "./BaseView";
import { MYColor } from "./Color";
import { MYFrame } from "../types/Frame";

const ButtonInner: React.FC<{
    action: () => void;
    children: React.ReactNode;
    context?: MYRenderContext;
}> = ({ action, children, context }) => {
    const [isPressed, setIsPressed] = useState(false);

    const isPressedRef = useRef(false);

    const pressOverlay = MYColor.rgb(1, 1, 1, isPressed ? 0.3 : 0).allowsHitTesting(false);

    const hitTestLayer = new MYAnyView(
        <MYBaseView
            renderContext={context}
            frame={{ maxWidth: Infinity, maxHeight: Infinity }}
            dynamicStyle={{
                onPointerDown: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = true;
                    setIsPressed(true);
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                },
                onPointerUp: (prev) => (e) => {
                    if (prev) prev(e);

                    if (isPressedRef.current) {
                        isPressedRef.current = false;
                        setIsPressed(false);
                        action();
                    }
                    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                },
                onPointerCancel: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = false;
                    setIsPressed(false);
                },
                onPointerLeave: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = false;
                    setIsPressed(false);
                }
            }}
        />
    );

    const finalContent = new MYAnyView(children)
        .overlay(pressOverlay)
        .overlay(hitTestLayer);

    return finalContent.body(context);
};

export class MYButton extends MYView {
    constructor(
        private readonly label: MYView,
        private readonly action: () => void,
    ) {
        super();
    }

    body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
        return (
            <ButtonInner
                action={this.action}
                children={this.label.body(context, frame)}
                context={context}
            />
        );
    }
}
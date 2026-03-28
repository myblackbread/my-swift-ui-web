import React from "react";
import {
    MYText,
    MYColor,
    MYVStack,
    MYHStack,
    MYZStack,
    MYRoundedRectangle,
    MYButton,
    MYCapsule,
    MYAnimations,
    MYSpacer,
    MYWindow
} from "@/my-ui";

export default function MusicPlayerExample() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const formatTime = (percent: number) => {
        const totalSeconds = 210;
        const currentSeconds = Math.floor((percent / 100) * totalSeconds);
        const mins = Math.floor(currentSeconds / 60);
        const secs = currentSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatRemaining = (percent: number) => {
        const totalSeconds = 210;
        const currentSeconds = Math.floor((percent / 100) * totalSeconds);
        const rem = totalSeconds - currentSeconds;
        const mins = Math.floor(rem / 60);
        const secs = rem % 60;
        return `-${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // 1. Обложка альбома
    const albumCover = new MYZStack([
        new MYText("🎧").font({ size: 130 }).foregroundStyle("white")
    ], "center")
        .frame({ width: 340, height: 340 })
        .background("linear-gradient(135deg, #FF2A54 0%, #8A2387 100%)")
        .clipShape(new MYRoundedRectangle(32, "continuous"))
        .scaleEffect(isPlaying ? 1 : 0.85)
        .animation(MYAnimations.easeInOut(0.6));

    // 2. Информация о треке
    const trackInfo = new MYHStack([
        new MYVStack([
            new MYText("Blinding Lights")
                .font({ size: 26, weight: "bold" })
                .foregroundStyle("white"),
            new MYText("The Weeknd")
                .font({ size: 20, weight: "medium" })
                .foregroundStyle(MYColor.rgb(180, 180, 180))
        ], 6, "left"),
        new MYSpacer(),
        new MYButton(
            () => alert("Открыто меню опций"),
            new MYText("•••")
                .font({ size: 24, weight: "bold" })
                .foregroundStyle("white")
                .padding({ edges: "bottom", length: 10 })
        )
    ], 0, "center")
        .padding({ edges: "top", length: 40 })
        .padding({ edges: "bottom", length: 24 });

    // 3. Прогресс-бар
    const progressBar = new MYVStack([
        new MYZStack([
            new MYColor("rgba(255, 255, 255, 0.2)"),
            new MYColor("white")
                .frame({ width: `${progress}%`, alignment: "left" })
        ], "left")
            .animation(MYAnimations.linear(0.5))
            .frame({ height: 6 })
            .clipShape(new MYCapsule()),

        new MYHStack([
            new MYText(formatTime(progress))
                .font({ size: 12, weight: "medium" })
                .foregroundStyle(MYColor.rgb(150, 150, 150)),
            new MYSpacer(),
            new MYText(formatRemaining(progress))
                .font({ size: 12, weight: "medium" })
                .foregroundStyle(MYColor.rgb(150, 150, 150))
        ], 0, "center")
            .padding({ edges: "top", length: 10 })
    ], 0, "left");

    // 4. Кнопки управления
    const controls = new MYHStack([
        new MYButton(
            () => setProgress(0),
            new MYText("⏮").font({ size: 40 }).foregroundStyle("white")
        ),
        new MYButton(
            () => setIsPlaying(!isPlaying),
            new MYText(isPlaying ? "⏸" : "▶").font({ size: 56 }).foregroundStyle("white")
        ),
        new MYButton(
            () => setProgress(100),
            new MYText("⏭").font({ size: 40 }).foregroundStyle("white")
        )
    ], 48, "center")
        .padding({ edges: "top", length: 30 })
        .onChange(isPlaying, (_, newValue) => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (newValue) {
                intervalRef.current = setInterval(() => {
                    setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
                }, 500);
            }
        })
        .onDisappear(() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        });

    // 5. Ползунок громкости
    const volumeBar = new MYHStack([
        new MYText("🔈").font({ size: 14 }).foregroundStyle("gray"),
        new MYZStack([
            new MYColor("rgba(255, 255, 255, 0.2)"),
            new MYColor("white").frame({ width: "70%", alignment: "left" })
        ], "left")
            .frame({ height: 4 })
            .clipShape(new MYCapsule()),
        new MYText("🔊").font({ size: 14 }).foregroundStyle("gray")
    ], 16, "center")
        .padding({ edges: "top", length: 45 });

    // Сборка всего UI
    const mainView = new MYVStack([
        albumCover,
        trackInfo,
        progressBar,
        controls,
        volumeBar
    ], 0, "center")
        .padding({ edges: "horizontal", length: 32 })
        .frame({ maxWidth: 420, maxHeight: Infinity })
        .background(MYColor.rgb(18, 18, 18));

    const screen = new MYZStack([mainView], "center")
        .frame({ maxWidth: Infinity, maxHeight: Infinity })
        .background(MYColor.black);

    return new MYWindow(screen).render();
}
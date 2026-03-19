import React from "react";
import {
    RenderMYView,
    MYText,
    MYColor,
    MYVStack,
    MYHStack,
    MYZStack,
    MYRoundedRectangle,
    MYButton,
    MYCapsule,
    MYAnimations
} from "@/my-ui";

export default function MusicPlayerExample() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0); // от 0 до 100
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Форматирование времени для плеера (например, 3:30)
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

    // --- UI Компоненты ---

    // 1. Обложка альбома (с анимацией увеличения при Play)
    const albumCover = new MYZStack([
        new MYText("🎧").font(120).foregroundColor("white")
    ])
        .frame({ width: 320, height: 320 })
        .background("linear-gradient(135deg, #FF2A54 0%, #FF5E3A 100%)")
        .clipShape(new MYRoundedRectangle(32))
        .scaleEffect(isPlaying ? 1 : 0.85)
        .animation(MYAnimations.easeInOut(0.5));

    // 2. Информация о треке
    const Spacer = new MYColor("transparent").frame({ maxWidth: Infinity });

    const trackInfo = new MYHStack([
        new MYVStack([
            new MYText("Blinding Lights")
                .font(24)
                .fontWeight("bold")
                .foregroundColor("white"),
            new MYText("The Weeknd")
                .font(18)
                .foregroundColor(MYColor.rgb(180, 180, 180))
        ], 4, "left"),
        Spacer,
        new MYButton(
            new MYText("•••")
                .font(24)
                .foregroundColor("white")
                .padding({ bottom: 10 }),
            () => alert("Открыто меню опций")
        )
    ], 0)
        .padding({ top: 30, bottom: 20 })
        .padding({ edges: "horizontal", length: 8 });

    // 3. Прогресс-бар
    const progressBar = new MYVStack([
        new MYZStack([
            new MYColor("rgba(255, 255, 255, 0.2)"),
            new MYColor("white")
                .frame({ width: `${progress}%` })
        ], "left")
            .animation(MYAnimations.linear(0.5))
            .frame({ height: 6 })
            .clipShape(new MYCapsule()),

        new MYHStack([
            new MYText(formatTime(progress))
                .font(12)
                .foregroundColor(MYColor.rgb(150, 150, 150)),
            Spacer,
            new MYText(formatRemaining(progress))
                .font(12)
                .foregroundColor(MYColor.rgb(150, 150, 150))
        ])
            .padding({ top: 8 })
    ], 0)
        .padding({ edges: "horizontal", length: 8 });

    // 4. Кнопки управления
    const controls = new MYHStack([
        new MYButton(
            new MYText("⏮")
                .font(40)
                .foregroundColor("white"),
            () => setProgress(0)
        ),
        new MYButton(
            new MYText(isPlaying ? "⏸" : "▶")
                .font(50)
                .foregroundColor("white"),
            () => setIsPlaying(!isPlaying)
        ),
        new MYButton(
            new MYText("⏭")
                .font(40)
                .foregroundColor("white"),
            () => setProgress(100)
        )
    ], 40, "center")
        .padding({ top: 30 })
        .onChange(isPlaying, (oldValue, newValue) => {
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
        new MYText("🔈")
            .font(12)
            .foregroundColor("gray"),
        new MYZStack([
            new MYColor("rgba(255, 255, 255, 0.2)"),
            new MYColor("white")
                .frame({ width: "70%" })
        ], "left")
            .frame({ height: 4 })
            .clipShape(new MYCapsule()),
        new MYText("🔊")
            .font(12)
            .foregroundColor("gray")
    ], 12).padding({ top: 40 });

    // Сборка всего экрана
    const mainView = new MYVStack([
        albumCover,
        trackInfo,
        progressBar,
        controls,
        volumeBar
    ], 0, "center")
        .frame({ width: 320 })
        .frame({ maxWidth: Infinity, maxHeight: Infinity })
        .background(MYColor.black);

    return <RenderMYView view={mainView} />;
}
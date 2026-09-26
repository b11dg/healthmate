"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="ru">
            <body
                style={{
                    display: "flex",
                    minHeight: "100vh",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    padding: "64px",
                    textAlign: "center",
                    background: "#faf9f9",
                    color: "#1f2933",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                    Что-то пошло не так
                </h1>
                <p
                    style={{
                        maxWidth: "360px",
                        fontSize: "14px",
                        color: "#5b6572",
                        margin: 0,
                    }}
                >
                    Приложение не смогло загрузиться. Попробуйте обновить
                    страницу.
                </p>
                <button
                    onClick={reset}
                    style={{
                        minHeight: "44px",
                        padding: "0 16px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#cc3b26",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                    }}
                >
                    Попробовать снова
                </button>
            </body>
        </html>
    );
}

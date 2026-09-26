// Gemini иногда набирает аббревиатуры в скобках вроде (HCT) кириллическими
// буквами-омоглифами (Н вместо H, Е вместо E, М вместо M...), из-за чего один и
// тот же показатель на разных бланках попадает в базу как два разных названия.
// Промпт в gemini.ts просит модель этого не делать, но подстраховываемся здесь —
// трогаем только содержимое круглых скобок, чтобы не задеть обычный кириллический текст.
const CYRILLIC_TO_LATIN: Record<string, string> = {
    А: "A",
    В: "B",
    Е: "E",
    К: "K",
    М: "M",
    Н: "H",
    О: "O",
    Р: "P",
    С: "C",
    Т: "T",
    Х: "X",
};

export function normalizeLabResultName(name: string): string {
    const collapsed = name.trim().replace(/\s+/g, " ");

    return collapsed.replace(/\(([^)]+)\)/g, (match, inner: string) => {
        if (!/^[A-ZА-ЯЁ0-9\s,/-]+$/.test(inner)) return match;
        const normalizedInner = Array.from(inner)
            .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
            .join("");
        return `(${normalizedInner})`;
    });
}

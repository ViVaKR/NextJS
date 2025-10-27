// src/lib/markdown.ts
import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it';
// 👇 bundledLanguagesInfo와 함께 BundledLanguage 타입도 가져와 보자 (존재한다면)
// 만약 BundledLanguage 타입이 없다면 이 라인은 제거하고 아래 langs 옵션에서 타입을 string[]으로 사용해도 Shiki가 알아서 처리할 가능성이 높음
import { bundledLanguagesInfo, type BundledLanguage } from 'shiki';

// Highlighter 인스턴스를 캐싱하기 위한 변수
let markdownItInstance: MarkdownIt | null = null;

const codeTheme = 'everforest-dark';
const lightTheme = 'github-light';

// --- Shiki가 인식하는 정식 언어 ID 목록만 추출 ---
// bundledLanguagesInfo에서 각 언어의 'id'만 추출한다.
// 이 ID들이 'BundledLanguage' 타입과 호환될 가능성이 매우 높다.
const bundledLanguageIds = bundledLanguagesInfo.map(langInfo => langInfo.id);
// --- 끝 ---

// 비동기로 MarkdownIt 인스턴스를 생성하고 반환하는 함수
export async function getMarkdownParser(): Promise<MarkdownIt> {
    if (markdownItInstance) {
        return markdownItInstance;
    }

    try {
        const shikiPlugin = await Shiki({
            themes: {
                light: lightTheme,
                dark: codeTheme,
            },
            // --- langs 옵션에 정식 언어 ID 목록 전달 ---
            // BundledLanguage 타입이 존재하고 bundledLanguageIds가 호환된다면 이대로 사용
            // 만약 BundledLanguage 타입 import가 실패하면, 그냥 bundledLanguageIds (string[])를 전달해도
            // Shiki 내부적으로 처리될 가능성이 높음 (타입 정의가 약간 엄격할 수 있음)
            langs: bundledLanguageIds as BundledLanguage[], // 타입 단언(as) 사용 또는 그냥 bundledLanguageIds 전달 시도
            // 또는 타입 단언 없이: langs: bundledLanguageIds,
            // --- 끝 ---
        });

        const md = MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
        }).use(shikiPlugin);

        markdownItInstance = md;
        return markdownItInstance;

    } catch (error) {
        console.error("Failed to initialize MarkdownIt with Shiki:", error);
        console.warn("Returning basic MarkdownIt instance without Shiki highlighting.");
        return MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
        });
    }
}

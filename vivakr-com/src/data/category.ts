// import { ICategory } from "@/interfaces/i-category";
import { categoryLang } from "./languages"
import { BundledLanguage } from "shiki";

export function getLanguageName(currentId: number): BundledLanguage {
    return categoryLang.find((lang) => lang.id === currentId)?.name as BundledLanguage;
}

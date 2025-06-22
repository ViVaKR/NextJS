import { ICategory } from "@/interfaces/i-category";
import { fetchCategories } from "./fetchCategories";
import { fetchCodesAsync } from "./fetchCodes";
import { ICode } from "@/interfaces/i-code";

export async function getCodes(): Promise<{ codes: ICode[]; categories: ICategory[] }> {
    const [codes, categories] = await Promise.all([
        fetchCodesAsync(),
        fetchCategories(),
    ]);
    return { codes, categories };
}


export async function getCategories(signal?: AbortSignal):
    Promise<{
        categories: ICategory[]
    }> {
    const [categories] = await Promise.all([
        fetchCategories(signal),
    ]);
    return { categories };
}

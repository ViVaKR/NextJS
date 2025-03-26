import { ICategory } from "@/interfaces/i-category";
import { languages } from "./languages"
import { BundledLanguage } from "shiki";

const categories: ICategory[] = [];
function addCategory(category: ICategory) {
    categories.push(category);
}

function setCategories() {
    addCategory({ id: 1, name: "C#" }); // 13
    addCategory({ id: 2, name: "ASP.NET Core" });  // 13
    addCategory({ id: 3, name: "JavaScript" }); // 29
    addCategory({ id: 4, name: "Angular" }); // 2
    addCategory({ id: 5, name: "Node.js" }); // 29
    addCategory({ id: 6, name: "Blazor" }); // 13
    addCategory({ id: 7, name: "Rust" }); // 66
    addCategory({ id: 8, name: "PowerShell" }); // 56
    addCategory({ id: 9, name: "Shell" }); // 72
    addCategory({ id: 10, name: "Ruby" }); // 65
    addCategory({ id: 11, name: "C/C++" }); // 12
    addCategory({ id: 12, name: "R" }); // 61
    addCategory({ id: 13, name: "Python" }); // 60
    addCategory({ id: 14, name: "Swift" }); // 76
    addCategory({ id: 15, name: "VBA" }); // 81
    addCategory({ id: 16, name: "Go" }); // 22
    addCategory({ id: 17, name: "HTML" }); // 24
    addCategory({ id: 18, name: "CSS/SCSS" }); // 14
    addCategory({ id: 19, name: "DB Server" }); // 74
    addCategory({ id: 20, name: "TypeScript" }); // 80
    addCategory({ id: 21, name: "Git" }); // 21
    addCategory({ id: 22, name: "Docker" }); // 17
    addCategory({ id: 23, name: "Assembly" }); // 6
    addCategory({ id: 24, name: "Web Server" }); // 50
    addCategory({ id: 25, name: "React/Vue.js" }); // 78
    addCategory({ id: 26, name: "Dart/Flutter" }); 16
    addCategory({ id: 27, name: ".NET" }); // 13
    addCategory({ id: 28, name: "Perl" }); // 52
    addCategory({ id: 29, name: "Kotlin/Java" }); // 36
    addCategory({ id: 30, name: "Name Server" }); // 70
    addCategory({ id: 31, name: "Math" }); // 37
    addCategory({ id: 32, name: "Note" }); // 44
}


function getLangId(id: number) {

    let langId = 13;
    switch (id) {
        case 1:
            return 13;
        case 2:
            return 13;
        case 3:
            return 29;
        case 4:
            return 2;
        case 5:
            return 29;
        case 6:
            return 13;
        case 7:
            return 66;
        case 8:
            return 56;
        case 9:
            return 72;
        case 10:
            return 65;
        case 11:
            return 12;
        case 12:
            return 61;
        case 13:
            return 60;
        case 14:
            return 76;
        case 15:
            return 81;
        case 16:
            return 22;
        case 17:
            return 24;
        case 18:
            return 14;
        case 19:
            return 74;
        case 20:
            return 80;
        case 21:
            return 21;
        case 22:
            return 17;
        case 23:
            return 6;
        case 24:
            return 50;
        case 25:
            return 79;
        case 26:
            return 16;
        case 27:
            return 13;
        case 28:
            return 52;
        case 29:
            return 36;
        case 30:
            return 70;
        case 31:
            return 37;
        case 32:
            return 44;
        default:
            return langId;
    }
}

export function getCategories(): ICategory[] {
    setCategories();
    return categories;
}


export function getLanguageName(id: number): BundledLanguage {
    return languages().find((lang) => lang.id === getLangId(id))?.name as BundledLanguage;
}

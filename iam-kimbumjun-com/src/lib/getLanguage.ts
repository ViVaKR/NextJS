function fetchLanguage(id: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // TODO: fetch language from language.js
        }, 1);
    });
}

export function getLanguage({ id }: { id: number }) {
    return fetchLanguage(id);
}

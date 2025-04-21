export async function apiFetch(url, options = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = response;
        error.text = errorText;
        throw error;
    }

    if (response.status === 401) {
        window.location.href = '/login';
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

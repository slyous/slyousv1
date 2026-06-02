export const getAuthToken = () => localStorage.getItem('auth_token');

export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);

export const clearAuthToken = () => localStorage.removeItem('auth_token');

export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchApi = async (url: string, options: RequestInit = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        clearAuthToken();
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    
    return response;
};

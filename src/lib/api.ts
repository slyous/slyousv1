import { fetchApi as authFetchApi } from './auth-api';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
    return authFetchApi(url, options);
};

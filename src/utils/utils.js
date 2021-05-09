const TOKEN_KEY = 'jwt';

export const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location = '/'
}

export const isLogin = () => {
    if (localStorage.getItem(TOKEN_KEY)) {
        return true;
    }

    return false;
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}
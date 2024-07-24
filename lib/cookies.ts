import { getCookie, setCookie, deleteCookie } from 'cookies-next';

function decodeJwtToken(token: string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}


export const setAuthCookie = (token: string, name: string) => {
    const toBase64 = Buffer.from(token).toString('base64');

    setCookie(name, toBase64, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        //security options
        // sameSite: 'strict',
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
    });
};

const getAuthCookie = (name: string) => {
    const cookie = getCookie(name);

    if (!cookie) return undefined;

    return Buffer.from(cookie, 'base64').toString('ascii');
};

export const getValidAuthTokens = () => {
    const token = getAuthCookie('AUTH_TOKEN');

    if (!token) return { token: undefined }

    const parsedToken = decodeJwtToken(token);

    const now = new Date();
    const tokenDate = new Date(parsedToken.exp * 1000 || 0);

    return {
        token: now < tokenDate ? token : undefined,
    };
};

export const removeCookies = (cookies: string[]) => {
    cookies.forEach((cookie) => {
        deleteCookie(cookie);
    });
};

export const expireCookies = (cookies: string[]) => {
    cookies.forEach((cookie) => {
        setCookie(cookie, '', {
            maxAge: 0,
            path: '/',
        });
    });
};

export const isTokenExpired = (expiryDate?: string) => {
    if (!expiryDate) return true;

    const now = new Date();
    const expiry = new Date(expiryDate);

    return now.getTime() > expiry.getTime();
};

export const isTokenExpiring = () => {
    // Step 1: Get the JWT token from the session
    const token = getAuthCookie('AUTH_TOKEN');
    if (token === undefined) return false

    const decodedToken = decodeJwtToken(token);
    const expirationTime = decodedToken.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    const remainingTime = expirationTime - currentTime;

    if (remainingTime < 300) { //300s = 5 minutes
        return true
    } else {
        return false
    }
}
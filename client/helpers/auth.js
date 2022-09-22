import cookie from 'js-cookie';
import Router from 'next/router';

// set cookie
export const setCookie = (key, value) => {
    // on client side
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1 // expires in 1 day
        });
    }
};

// remove from cookie
export const removeCookie = (key) => {
    // on client side
    if (process.browser) {
        cookie.remove(key);
    }
};

// get from cookie
// will be useful when we need to make requests to server with auth token
export const getCookie = (key, req) => {
    // if (process.browser) {
    //     return cookie.get(key);
    // }
    return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
    return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined;
    }
    //console.log('req.headers.cookie:', req.headers.cookie);
    let token = req.headers.cookie.split(';').find(cookie => cookie.trim().startsWith(`${key}=`));
    if (!token) {
        return undefined;
    }
    let tokenValue = token.split('=')[1];
    //console.log('getCookieFromServer:', tokenValue);
    return tokenValue;
};

// set local storage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// remove from local storage
export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};

// authenticate user by passing data to cookie and local storage during login
export const authenticate = (response, next) => {
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
};

// access user info from local storage
export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false;
            }
        }
    }
};

export const logout = () => {
    removeCookie('token');
    removeLocalStorage('user');
    Router.push('/login');
};

export const updateUser = (user, next) => {
    if (process.browser) {
        if(localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'));
            auth = user;
            localStorage.setItem('user', JSON.stringify(auth));
            next();
        }
    }
};


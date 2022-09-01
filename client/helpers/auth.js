import cookie from 'js-cookie';

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
export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key);
    }
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
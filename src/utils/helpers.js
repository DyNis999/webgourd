import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    next();
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('token')) {
            return JSON.parse(sessionStorage.getItem('token'));
        } else {
            return false;
        }
    }
};

export const isAdminUser = () => {
    const user = getUser();
    return user && user.role === 'admin';
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = sessionStorage.getItem('user');
        if (user) {
            return JSON.parse(user);
        } else {
            return false;
        }
    }
    console.error('window is undefined');
    return false;
};

export const logout = next => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
    next();
};

export const errMsg = (message = '') => toast.error(message, {
    position: 'bottom-right'
});

export const successMsg = (message = '') => toast.success(message, {
    position: 'bottom-right'
});
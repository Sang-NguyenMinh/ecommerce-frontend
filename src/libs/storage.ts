import { GetServerSidePropsContext, PreviewData } from 'next';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import { ParsedUrlQuery } from 'querystring';

export const Storage = {
    Cookie: {
        get: <T>(key: string, defaultValue?: any): T | undefined => {
            const item = cookie.get(key);
            if (item === undefined) return undefined;

            try {
                return JSON.parse(item);
            } catch {
                return defaultValue;
            }
        },
        set: <T>(key: string, value: T, expires = 1) => {
            cookie.set(key, JSON.stringify(value), { expires });
        },
        remove: (key: string) => {
            cookie.remove(key);
        },
    },
    ServerCookie: {
        get: <T>(
            key: string,
            ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
        ): T | undefined => {
            const item = nextCookie(ctx, { doNotParse: true })[key];
            if (item === undefined) return undefined;

            try {
                return JSON.parse(item);
            } catch {
                return undefined;
            }
        },
    },
    Session: {
        get: <T>(key: string): T | undefined => {
            const item = sessionStorage.getItem(key);
            if (item === null) return undefined;

            try {
                return JSON.parse(item);
            } catch {
                return undefined;
            }
        },
        set: <T>(key: string, value: T) => {
            if (value === null) return;
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        remove: (key: string) => {
            sessionStorage.removeItem(key);
        },
    },
    Local: {
        get: <T>(key: string): T | undefined => {
            const item = localStorage.getItem(key);
            if (item === null) return undefined;

            try {
                return JSON.parse(item);
            } catch {
                return undefined;
            }
        },
        set: <T>(key: string, value: T) => {
            if (value === null) return;
            localStorage.setItem(key, JSON.stringify(value));
        },
        remove: (key: string) => {
            localStorage.removeItem(key);
        },
    },
};

/* global chrome */

export const getAuthCookie = () => {
    return new Promise<string>((resolve) => {
        console.log(import.meta.env.VITE_CLIENT_URL)
        chrome.cookies.get({ url: import.meta.env.VITE_CLIENT_URL, name: "auth" }, (cookie) => {
            if (cookie) {
                resolve(cookie.value);
            } else {
                resolve("");
            }
        });
    });
};

export const setAuthCookie = async (value: string) => {
    return await chrome.cookies.set({ url: import.meta.env.VITE_CLIENT_URL, name: "auth", value: value }, (cookie) => {
        if (cookie) {
            return cookie.value
        } else {
            return null
        }
    })
}

export const removeAuthCookie = async () => {
    return await chrome.cookies.remove({ url: import.meta.env.VITE_CLIENT_URL, name: "auth" })
}

export const Logout = async () =>{
    removeAuthCookie()
}

export const getGoogleToken = async () => {
        return await chrome.identity.getAuthToken({ 
          interactive: true,
          scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        })
}


/* global chrome */
export const getAuthStorage = async () => {
    const token = await chrome.storage.local.get(['auth']);
    if (token) {
        return token.auth;
    }
    return "";
};

export const setAuthStorage = async (value: string) => {
    await chrome.storage.local.set({ auth: value });
    return value;
}

export const removeAuthStorage = async () => {
    return await chrome.storage.local.remove(['auth'])
}

export const Logout = async () =>{
    removeAuthStorage()
}

export const getGoogleToken = async () => {
    return chrome.identity.getAuthToken({ 
        interactive: true,
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    })
}


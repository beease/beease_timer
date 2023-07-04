/* global chrome */
import { getUserInfos, clearAuth } from './googleAuth';
// import { GetSpecificUser } from '../../api/Get'
// const URL = process.env.BEEASE_API

export const getAuthCookie = () => {
    return new Promise<string | null>((resolve, reject) => {
        chrome.cookies.get({ url: String(process.env.VITE_CLIENT_URL), name: "auth" }, (cookie) => {
            if (cookie) {
                resolve(cookie.value);
            } else {
                resolve(null);
            }
        });
    });
};

export const setAuthCookie = async (value: string) => {
    return await chrome.cookies.set({ url: String(process.env.VITE_CLIENT_URL), name: "auth", value: value }, (cookie) => {
        if (cookie) {
            return cookie.value
        } else {
            return null
        }
    })
}

export const removeAuthCookie = async () => {
    return await chrome.cookies.remove({ url: String(process.env.VITE_CLIENT_URL), name: "auth" })
}

 
// export const Login = async () => {
//     const googleInfos: any = await getUserInfos()
//     return chrome.storage.local.set({ 'userId': googleInfos.id }).then(() => {
//         console.log("User id set to "+googleInfos.id );
//         return googleInfos.id
//     });
//     // if(!await GetSpecificUser(googleInfos.id)){
//     //     // const newUser = await postUser(googleInfos)
//     //     return chrome.storage.local.set({ 'userId': newUser.google_id }).then(() => {
//     //         console.log("new User id set to "+newUser.google_id );
//     //         return newUser.google_id
//     //     });
//     // }else{
//     //     return chrome.storage.local.set({ 'userId': googleInfos.id }).then(() => {
//     //         console.log("User id set to "+googleInfos.id );
//     //         return googleInfos.id
//     //     });
//     // }
// };

export const Login = async () => {
        return await chrome.identity.getAuthToken({ 
          interactive: true,
          scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        })
}


export const Logout = async () =>{
    chrome.storage.local.remove(["userId"]).then(() => {
        console.log("Value of userId is clear");
    });
    clearAuth()
}
/* global chrome */
import { getUserInfos, clearAuth } from './googleAuth';
// import { GetSpecificUser } from '../../api/Get'
// const URL = process.env.BEEASE_API



const postUser = async (googleData: any) => {
    return fetch(URL+'user',{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            family_name: googleData.family_name,
            given_name: googleData.given_name,
            google_id: googleData.id,
            locale: googleData.locale,
            name: googleData.name,
            picture: googleData.picture,
            email: googleData.email
        })
    }).then(result => {
        return result.json();
    })
    .then(data => {
        console.log(`user ${data.name} added`)
        return data
    })
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
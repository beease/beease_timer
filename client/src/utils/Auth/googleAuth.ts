/* global chrome */
export const clearAuth = () => {
    chrome.storage.local.get(['googleToken']).then((result) => {
        chrome.identity.removeCachedAuthToken({token: result.googleToken});
        const revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + result.googleToken;
        fetch(revokeUrl, {
          method: 'POST'
        })
    })
}

export const getUserInfos = () => {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ 
        interactive: true,
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
      }, function (token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }    
        chrome.storage.local.set({ 'googleToken': token }).then(() => {
          console.log("Token is set to " + token);
        });
        fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to load user photo.');
          }
        })
        .then(data => {
          console.log(data)
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          reject(new Error('Failed to make API request.'));
        });
      });
    });
  }
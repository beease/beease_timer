export const signInvitationPage = (loginUri:string) => {
    return (`
    <!DOCTYPE html>
  <html>
  <head>
    <title>Connexion avec Google</title>
  </head>
  <body>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <div id="g_id_onload"
      data-client_id="377990403127-s7ul9jtmi4stmvvd97qlvjv21sdqlk12.apps.googleusercontent.com"
      data-callback="handleCredentialResponse"
      data-auto_prompt="false">
    </div>
    <div class="g_id_signin"
      data-type="standard"
      data-size="large"
      data-theme="outline"
      data-text="sign_in_with"
      data-shape="rectangular"
      data-logo_alignment="left"
      data-width=400>
    </div>
    <script>
    
    const urlParams = new URLSearchParams(window.location.search);
    const invitationToken = urlParams.get('invitationToken');
    const loginUri = "${loginUri}?invitationToken=" + invitationToken;
  
      window.handleCredentialResponse = function(response) {
        console.log(response.credential)
        const body = JSON.stringify({credential:response.credential,invitationToken:invitationToken});
        console.log(body)
        const headers = { 'Content-Type': 'application/json' };
        
        // Use the loginUri variable in your fetch function.
        fetch(loginUri, { method: 'POST', headers, body })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
              console.error(res.error);
              return;
            }else{
              return window.location.href = res.redirectUri;
            }
        });      
      }
    </script>
  </body>
  </html>
    `);
    }

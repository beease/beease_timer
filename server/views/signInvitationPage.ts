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
      data-login_uri=${loginUri}
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
  </body>
  </html>
    `);
    }

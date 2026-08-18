// SuperHeroes 2.0 Helper Utilities & Google Identity Services (GIS) Interop

window.downloadFileBlob = (fileName, contentType, content) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.googleDriveHelper = {
    tokenClient: null,
    currentClientId: null,

    requestAccessToken: function (clientId) {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
                reject(new Error("Google Identity Services script not loaded. Check internet connection."));
                return;
            }

            try {
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email',
                    callback: (tokenResponse) => {
                        if (tokenResponse && tokenResponse.access_token) {
                            resolve(tokenResponse.access_token);
                        } else if (tokenResponse && tokenResponse.error) {
                            reject(new Error(tokenResponse.error_description || tokenResponse.error));
                        } else {
                            reject(new Error("No access token returned from Google."));
                        }
                    },
                    error_callback: (nonOAuthError) => {
                        reject(new Error(nonOAuthError.message || "Google OAuth Error"));
                    }
                });

                tokenClient.requestAccessToken({ prompt: 'consent' });
            } catch (err) {
                reject(err);
            }
        });
    }
};

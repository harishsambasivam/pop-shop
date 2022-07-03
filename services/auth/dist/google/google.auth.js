import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
dotenv.config();
const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret, OAUTH_AUDIENCE: oauthAudience } = process.env;
export const oAuth2Client = new OAuth2Client(clientId, clientSecret, "http://localhost:3000/oauth/google/redirect");
export const googleStrategy = new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/oauth/google/redirect",
    scope: ["profile", "email"],
}, async function verify(accessToken, refreshToken, params, profile, cb) {
    console.log(JSON.stringify({ accessToken, refreshToken, params, profile, cb }, null, 2));
    cb(null, profile);
});
export const refreshTokens = async (clientId, clientSecret, refreshToken) => {
    try {
        const payload = JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        });
        const config = {
            method: "post",
            url: "https://www.googleapis.com/oauth2/v4/token",
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };
        const { data } = await axios(config);
        return data;
    }
    catch (err) {
        throw err;
    }
};
export const validateAccessToken = async (accessToken) => {
    try {
        const data = await oAuth2Client.getTokenInfo(accessToken);
        return data;
    }
    catch (err) {
        throw err;
    }
};
export const validateIdToken = async (idToken) => {
    try {
        const data = await oAuth2Client.verifyIdToken({
            idToken: idToken,
            audience: [
                oauthAudience
            ]
        });
        return data;
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=google.auth.js.map
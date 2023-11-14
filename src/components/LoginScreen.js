import * as React from "react"
import { Button, Loading } from "../index.js" 

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
const codeVerifier  = generateRandomString(128);

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

export const LoginScreen = ({loggedIn, setLoggedIn}) => {
    const appId = "1750bdcf3560454783106e7460f9a950"
    // const appSec = "d543a6e15cde4bcd8e52292084eb4c67"
    const redirectUri = 'http://localhost:3000';
    const [errorState, setErrorState] = React.useState(0);
    const [token, setToken] = React.useState("");

    const getCode = () => {        
        const scope = 'user-read-private user-read-email';
        const authUrl = new URL("https://accounts.spotify.com/authorize")
        
        window.localStorage.setItem('code_verifier', codeVerifier);
        
        const params =  {
          response_type: 'code',
          client_id: appId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri,
        }
        
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
        
        /*
        at this point, the user is taken to a spotify screen prompting for creds
        then, they auth the application to have the requested scopes
        then, they are redirected back to the local "server"
        the redirect includes the auth code in the headers, so the below grabs it
        */

        const urlParams = new URLSearchParams(window.location.search);
        let code;
        if (urlParams.get("code")) {
            code = urlParams.get("code")
        } else {
            setErrorState(errorState + 1)
            code = urlParams.get("error")
        };
        console.debug(`Code: ${code}`)
    }

    const getToken = async code => {
        let codeVerifier = localStorage.getItem('code_verifier');
    
        const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: appId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
        }
        const url = "https://accounts.spotify.com/api/token"
    
        const body = await fetch(url, payload);
        const response = await body.json();
    
        localStorage.setItem('access_token', response.access_token);
    }


    const login = () => {
        const code = getCode();
        setToken(getToken(code))
        errorState === 0 ? setLoggedIn(true) : setLoggedIn(false)
    }

    return(
        <>
            {!loggedIn ? <Button text="Login" action={login} /> : <Loading />}
            {token}
        </>
    )
}
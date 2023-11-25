import * as React from "react"
import { Button, Loading } from "../index.js" 

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    // const hashArray = Array.from(new Uint8Array(input));
    // return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    /*
    for some reason this way of processing the arraybuffer doesn't work
    oh well let's try this one
    */

    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    // i do not know why they compute differently. utf16 vs 8 maybe? idk lol
}

let codeVerifier;
if (!window.localStorage.getItem('code_verifier')) {
    codeVerifier = generateRandomString(128);
    window.localStorage.setItem('code_verifier', codeVerifier);
} else codeVerifier = window.localStorage.getItem('code_verifier');

const verifierHash = await sha256(codeVerifier);
const codeChallenge = base64encode(verifierHash)
window.localStorage.setItem('code_challenge', codeChallenge)

export const LoginScreen = ({ setLoggedIn }) => {
    const appId = process.env.REACT_APP_SPOTIFY_ID
    const redirectUri = 'http://localhost:3000/callback';
    const errorState = React.useRef(0);
    const loading = React.useRef(false);

    const getCode = () => {
        const scope = [
            'app-remote-control',
            'playlist-modify-private',
            'playlist-modify-public',
            'playlist-read-collaborative',
            'playlist-read-private',
            'streaming',
            'ugc-image-upload',
            'user-follow-modify',
            'user-follow-read',
            'user-library-modify',
            'user-library-read',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'user-read-email',
            'user-read-playback-position',
            'user-read-playback-state',
            'user-read-private',
            'user-read-recently-played',
            'user-top-read',
        ].join(' ').trimEnd();
        
        const authUrl = new URL("https://accounts.spotify.com/authorize") // creates new URL obj
        
        const params =  {
          response_type: 'code',
          client_id: appId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: window.localStorage.getItem('code_challenge'),
          redirect_uri: redirectUri,
        } // obj containing the search params
        
        authUrl.search = new URLSearchParams(params).toString();
        // converts params obj to URLSearchParams obj then to string;
        // adds to URL's "search" prop
        window.location.href = authUrl.toString(); // redirection to Spotify
        
        /*
        at this point, the user is taken to a spotify screen prompting for creds
        then, they auth the application to have the requested scopes
        then, they are redirected back to the local "server"
        the redirect includes the auth code in the headers which is grabbed and 
        stored locally later.
        */
    }

    const getToken = async code => {
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
                code_verifier: localStorage.getItem('code_verifier'),
            }),
        }
        const url = "https://accounts.spotify.com/api/token"
    
        const body = await fetch(url, payload);
        const response = await body.json();
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        window.location.href = window.location.origin;
    }

    if (window.location.search.startsWith("?code" || window.location.search.startsWith("?error"))) {
        const urlParams = new URLSearchParams(window.location.search); // parse the current url looking for params

        let code;
        if (urlParams.get("code")) { // if the params are found
            code = urlParams.get("code") // give us the code in the params
            localStorage.setItem("access_code", code) // this may be deprecated now?
        } else {
            errorState.current = errorState.current + 1 // if no code is found, we've hit an error
            code = urlParams.get("error") // gimme dat erruh
            localStorage.setItem("error", code) // cache dat erruh
            console.error(code) // log dat erruh
        };
        if (!localStorage.getItem('access_token')) getToken(code);
        else ( errorState.current === 0 ? setLoggedIn(true) : setLoggedIn(false) )
        loading.current = false;
    }

    

    return(
        <>
            {!loading.current ? <Button text="Login" action={getCode} /> : <Loading />}
        </>
    )
}
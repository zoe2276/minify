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

const waitFor = (conditionFunc) => { // build a delay function to wait until a cond is true
    const poll = resolve => { // build loop
        if (conditionFunc()) resolve(); // resolve the promise if the condition is true
        else setTimeout(() => poll(resolve), 500) ; // otherwise loop back through after .5s
    }
    return new Promise(poll); // return the promise; can be used as .then() flow or "await" keyword
}

const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

export const LoginScreen = ({loggedIn, setLoggedIn}) => {
    const appId = "1750bdcf3560454783106e7460f9a950"
    // const appSec = "d543a6e15cde4bcd8e52292084eb4c67"
    const redirectUri = 'http://localhost:3000/callback';
    const [errorState, setErrorState] = React.useState(0);
    const [token, setToken] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const getCode = () => {        
        const scope = 'user-read-private user-read-email';
        const authUrl = new URL("https://accounts.spotify.com/authorize") // creates new URL obj
        
        window.localStorage.setItem('code_verifier', codeVerifier);
        
        const params =  {
          response_type: 'code',
          client_id: appId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
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
        the redirect includes the auth code in the headers, so the below grabs it
        */

        waitFor(() => window.location.origin === "https://localhost:3000")
        .then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            console.log(`urlParams: ${urlParams}`)
            let code;
            if (urlParams.get("code")) {
                code = urlParams.get("code")
                localStorage.setItem("access_code", code)
            } else {
                setErrorState(errorState + 1)
                code = urlParams.get("error")
                localStorage.setItem("error", code)
                console.log(code)
            };
            console.debug(`Code: ${code}`)
            setLoading(true);
        })

    }

    const getToken = async code => {
        // Need to route this out; call when window.href contains /callback and fire this? may have to abstract it out of component
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
        console.log(response)
        localStorage.setItem('access_token', response.access_token);
        setToken(response.access_token);
    }

    if (window.location.pathname === "/callback") {
        waitFor(() => localStorage.getItem("access_code"))
        .then(() => {
            setLoading(false)
            getToken(localStorage.getItem("access_code"))
            localStorage.getItem("access_token") ?
                ( errorState === 0 ? setLoggedIn(true) : setLoggedIn(false) ) :
                setLoggedIn(false)
        })
    }

    return(
        <>
            {!loggedIn && <Button text="Login" action={getCode} />}
            {loading && <Loading />}
            {token}
        </>
    )
}
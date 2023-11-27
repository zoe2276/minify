export const apiCall = async (url, method, inputData = undefined) => {
    const uri = new URL(url);
    const payload = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`
        },
    }
    if (method !== 'GET') payload.body = JSON.stringify(inputData)
    let body = await fetch(uri, payload);

    if (body.status === 401) {
        const refreshBody = await fetch(new URL('https://accounts.spotify.com/api/token'), {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: window.localStorage.getItem('refresh_token'),
                client_id: process.env.REACT_APP_SPOTIFY_ID
            })
        })
        if (refreshBody.status === 200) {
            const refreshRes = await refreshBody.json();
            window.localStorage.setItem('access_token', refreshRes.access_token);
            window.localStorage.setItem('refresh_token', refreshRes.refresh_token);
            body = await fetch(uri, payload);
        } else {
            console.error('uhh refresh failed?')
        }
    } else if (body.status === 429) {
        console.error('ratelimited');
        return;
    }

    let response;
    try {
        response = await body.json();

        if (response.error.reason === "NO_ACTIVE_DEVICE") {
            // resend the API call with the current device ID
            console.log("playback inactive");
        }
        
    } catch (e) {
        // console.error(e);
        // console.log('if this is a syntax error abt the json its fine i promise');
    }

    return response;
}
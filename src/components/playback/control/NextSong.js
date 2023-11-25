import React from 'react'
import { apiCall } from '../../../index'
export const NextSong = () => {
    const display = "Next"

    const skip = async () => {
        // api call to next endpoint to skip song
        const endpoint = "https://api.spotify.com/v1/me/player/next";
        const res = await apiCall(endpoint, 'POST')
        if (res) console.error(res);
        console.log('next song')
        // probably throw in a get request to the current playback state when we are tracking now playing stuff
    }

    return (
        <div id="button-nextSong" className="button" onClick={() => skip()}>
            {display}
        </div>
    )
}
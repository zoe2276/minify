import React from 'react'
import { apiCall } from '../../../index'
export const PreviousSong = () => {
    const display = "Previous"

    const previous = async () => {
        // api call to next endpoint to skip song
        const endpoint = "https://api.spotify.com/v1/me/player/previous";
        const res = await apiCall(endpoint, 'POST')
        if (res) console.error(res);
        console.log('previous song')
        // probably throw in a get request to the current playback state when we are tracking now playing stuff
    }

    return (
        <div id="button-nextSong" className="button" onClick={() => previous()}>
            {display}
        </div>
    )
}
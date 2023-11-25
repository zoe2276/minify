import React from 'react'
import { apiCall } from '../../../index'
export const TogglePlayback = ({ progress, setProgress, isPlaying, setIsPlaying }) => {
    // temp assigment of text to the icons until those are made
    const playIcon = "Play";
    const pauseIcon = "Pause";
    
    const play = async () => {
        // api call to play song endpoint
        const endpoint = "https://api.spotify.com/v1/me/player/play"
        const res = await apiCall(endpoint, 'PUT', {position_ms: progress});
        if (res) console.error(res) // some sort of error definition?
        setIsPlaying(true)
        console.log('now playing')
    }

    const pause = async () => {
        // api call to get current player time
        const endpoint_currentState = "https://api.spotify.com/v1/me/player";
        const res_currentState = await apiCall(endpoint_currentState, 'GET');
        setProgress(res_currentState.progress_ms)
        // api call to pause song endpoint
        const endpoint = "https://api.spotify.com/v1/me/player/pause";
        const res = await apiCall(endpoint, 'PUT');
        if (res) console.error(res);
        setIsPlaying(false)
        console.log('now pausing')
    }

    let display, action;
    if (!isPlaying) {
        display = playIcon;
        action = play;
    } else {
        display = pauseIcon;
        action = pause;
    }

    return (
        <div id="button-playback" className="button" onClick={() => action()}>
            {display}
        </div>
    )
}
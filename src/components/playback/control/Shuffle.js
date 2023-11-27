import React from 'react'
import { apiCall } from '../../../index'
export const Shuffle = ({shuffleState, setShuffleState}) => {
    const display = "Shuffle"

    const shuffle = async () => {
        // api call to shuffle toggle endpoint for context toggling
        const endpoint = `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffleState}`;
        const res = await apiCall(endpoint, 'PUT');
        if (res) console.error(res);
        setShuffleState(!shuffleState);
        console.log(`shuffle set to ${!shuffleState}`);
    }

    const classList = `button${shuffleState ? ' active' : ''}`

    return (
        <div id="button-shuffle" className={classList} onClick={() => shuffle()}>
            {display}
        </div>
    )
}
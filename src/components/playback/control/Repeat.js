import React from 'react'
import { apiCall } from '../../../index'
export const Repeat = ({repeatState, setRepeatState}) => {
    const display = "Repeat"

    const repeat = async () => {
        // initialize loop states and set up method to cycle through them
        const loopStates = ['context', 'track', 'off']; // this is too pure.. not reactive to current repeat state.
        while (loopStates[0] !== repeatState) {
            const shifting = loopStates.shift();
            loopStates.push(shifting);
        } // this should organize it properly?
        // do it again, otherwise it gets stuck on "off"
        const temp_nextState = loopStates.shift();
        loopStates.push(temp_nextState);
        // now for real, grab that value
        const nextState = loopStates.shift();
        setRepeatState(nextState);
        loopStates.push(nextState);
        // api call to repeat endpoint
        const endpoint = `https://api.spotify.com/v1/me/player/repeat?state=${repeatState}`;
        const res = await apiCall(endpoint, 'PUT');
        if (res) console.error(res);
        console.log(`repeat set to ${repeatState}`);
    }

    return (
        <div id="button-repeat" className="button" onClick={() => repeat()}>
            {display}
        </div>
    )
}
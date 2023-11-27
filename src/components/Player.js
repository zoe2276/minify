import React from 'react';
import * as Control from "../components/playback/control"
// import * as Display from "../components/playback/display"
import { apiCall } from "../index";
// import { Button } from '../index.js';

export const Player = () => {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [progress, setProgress] = React.useState(0);
    const [repeatState, setRepeatState] = React.useState("off");
    const [shuffleState, setShuffleState] = React.useState(false);

    const [contextImage, setContextImage] = React.useState();

    const [spotifyPlayer, setSpotifyPlayer] = React.useState();
    const [deviceId, setDeviceId] = React.useState();
    
    const buildStateObj = async () => {
        const url ="https://api.spotify.com/v1/me/player"
        const response = await apiCall(url, 'GET')
        return response;
    }

    const buildCurrentlyPlayingObj = async () => {
        const url ="https://api.spotify.com/v1/me/player/currently-playing"
        const response = await apiCall(url, 'GET')
        return response;
    }

    const getDevices = async () => {
        const url = "https://api.spotify.com/v1/me/player/devices"
        const response = await apiCall(url, 'GET')
        return await response;
    }

    const transferPlayback = React.useCallback(() => {
        // this will need to be extracted as a component when i have a device transfer system in place
        // or, do i want to put it into apiCall.js as an automatic fallback fn?
        // or, do i want to add it as an optional param for the above instead, to fire on specific calls?
        // i have no idea
        const id = deviceId;
        const transfer = async () => {
            const url = "https://api.spotify.com/v1/me/player";
            const response = await apiCall(url, 'PUT', {device_ids: [id]});
            return await response;
        }
        return transfer();
    }, [deviceId])

    React.useEffect(() => {
        // load the webplayer SDK from spotify
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const device = new window.Spotify.Player({
                name: 'minify',
                getOauthToken: cb => cb(window.localStorage.getItem('access_token')),
                volume: 0.5
            })
            setSpotifyPlayer(device);
            // onReady listener to cache our deviceId
            // currently pulls as undefined, likely due to lack of VMP signing?
            device.addListener('ready', ({ id }) => {
                console.log('Ready with Device ID', id);
                setDeviceId(id);
            });

            // disconnection handler
            device.addListener('not_ready', ({ id }) => {
                console.log('Device ID has gone offline', id);
                device.disconnect();
            });

            // error detection (we can do something with these later)
            device.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            device.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            device.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            // connect the device (activates it)
            device.connect();
        }

    }, [])

    React.useEffect(() => {
        const buildObjs = async () => {
            const temp_stateObj = await buildStateObj()
            const temp_currentlyPlayingObj = await buildCurrentlyPlayingObj()
            return {'stateObj': temp_stateObj, 'currentlyPlayingObj': temp_currentlyPlayingObj}
        }
        const {stateObj, currentlyPlayingObj} = buildObjs();

        try {
            setRepeatState(stateObj.repeat_state);
            setShuffleState(stateObj.shuffle_state);
            setProgress(stateObj.progress_ms)
            setIsPlaying(stateObj.is_playing)
        } catch (err) {
            // most likely means there is no current playback activity. for now we will just log this
            // in the future, repost with id when i have a device id
            // this is that attempt
            const playbackTransfer = async () => {
                return await transferPlayback();
            }
            playbackTransfer();
            console.error(err);
            // console.debug('apparent cause (current stateObj):');
        }

        try {
            if (currentlyPlayingObj.item.album) setContextImage(currentlyPlayingObj.item.album)
            else if (currentlyPlayingObj.item.playlist) setContextImage(currentlyPlayingObj.currentTrack.item.playlist)
        } catch (err) {
            // same deal.
            console.error(err);
            console.debug('apparent cause (current currentlyPlayingObj):');
            console.debug(currentlyPlayingObj);
            console.debug('attempting to transfer playback to the current device:')
            const playbackTransfer = async () => {
                return await transferPlayback()
            }
            playbackTransfer();
        }

    }, [transferPlayback, deviceId])

    console.debug(`contextImage:\n${contextImage}`)

    return (
        <>
            <div id='now-playing-wrapper'>
                {/* <Display.Art contextArtData={contextImage} /> */}
                {spotifyPlayer && deviceId}
            </div>
            <div id='playback-button-wrapper'>
                <Control.Shuffle shuffleState={shuffleState} setShuffleState={setShuffleState} />
                <Control.PreviousSong />
                <Control.TogglePlayback progress={progress} setProgress={setProgress} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                <Control.NextSong />
                <Control.Repeat repeatState={repeatState} setRepeatState={setRepeatState} />
            </div>
            <br />
            <Control.Devices rawDevices={() => getDevices()} activateDevice={id => {
                const transfer = async () => {
                    const url = "https://api.spotify.com/v1/me/player";
                    const response = await apiCall(url, 'PUT', {device_ids: [id]});
                    return await response;
                }
                transfer().then(() => {
                    console.log(`playback transferred to device ${id}`)
                    getDevices();
                })
            }} removeDevice={id => {
                console.log(`remove ${id} manually. i can't do it yet.`)
            }} />
        </>
    )
}
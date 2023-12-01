import React from 'react';
import * as Control from "../components/playback/control"
import * as Display from "../components/playback/display"
import { apiCall } from "../index";
// import { Button } from '../index.js';

export const Player = () => {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [progress, setProgress] = React.useState(0);
    const [repeatState, setRepeatState] = React.useState("off");
    const [shuffleState, setShuffleState] = React.useState(false);

    const [contextMeta, setContextMeta] = React.useState();
    const [trackLength, setTrackLength] = React.useState();

    const [player, setPlayer] = React.useState();
    const [active, setActive] = React.useState();
    const [deviceId, setDeviceId] = React.useState();

    if (!deviceId) {} // idk just to get the linter to stop screaming at me that i'm not using it yet
    
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

    const seek = async (position_ms) => {
        const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`;
        const response = await apiCall(url, 'PUT');
        return await response;
    }
    
    const handleDisplayObjs = React.useCallback((level = undefined) => {
        if (!level) {
            buildStateObj().then(res => {
                setRepeatState(res.repeat_state);
                setShuffleState(res.shuffle_state);
                setProgress(res.progress_ms);
                setIsPlaying(res.is_playing);
            }).catch(err => {}) // no catch for now

            buildCurrentlyPlayingObj().then(res => {
                setContextMeta(res.item);
                setTrackLength(res.item.duration_ms);
            }).catch(err => {})
        };
    }, [])

    React.useEffect(() => {
        // load the webplayer SDK from spotify
        if (!player) {
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

                setPlayer(device);

                // onReady listener to cache our deviceId; doesn't work
                // have to manually api call to devices endpoint
                device.addListener('ready', ({ id }) => {
                    if (id !== undefined) setDeviceId(id)
                    else {
                        const url = "https://api.spotify.com/v1/me/player/devices";
                        apiCall(url, 'GET').then(res => {
                            res.devices.forEach(e => {
                                if (e.name === 'minify') {
                                    setDeviceId(e.id);
                                }
                            })
                        })
                    }
                });

                // disconnection handler
                device.addListener('not_ready', ({ id }) => {
                    console.log('Device ID has gone offline', id);
                    device.disconnect();
                });

                // player state change trigger to keep our info up to date
                device.addListener('player_state_changed', state => {
                    if (!state) return;

                    device.getCurrentState().then(state => {
                        !state ? getDevices().then(res => {
                            res.foreach(e => {if (e.is_active) setActive(e.id)})
                        }).catch(err => {/*we'll deal with this later*/}) : console.debug(state.device_id, 'ignore me');
                    })

                    handleDisplayObjs();
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
        }

        let displayUpdater = setInterval(() => {if (isPlaying) setProgress(progress + 500)}, 500)
        return () => {clearInterval(displayUpdater)}
    }, [handleDisplayObjs, isPlaying, player, progress])

    const transferPlayback = id => {
        const transfer = async () => {
            const url = "https://api.spotify.com/v1/me/player";
            const response = await apiCall(url, 'PUT', {device_ids: [id]});
            return await response;
        }
        transfer().then(() => {
            console.log(`playback transferred to device ${id}`)
            setActive(id)
            // getDevices();
            handleDisplayObjs();
        })
    }
    
    React.useMemo(() => {
        if (isPlaying) handleDisplayObjs();
    }, [handleDisplayObjs, isPlaying])

    if (contextMeta === undefined) console.debug('no context metadata found...');

    return (
        <>
            <div id='playback-wrapper'>
                <div id='now-playing-wrapper'>
                    {contextMeta ? <>
                        <Display.Art contextArtData={contextMeta.album} />
                        <Display.TrackInfo contextInfo={contextMeta} />
                        <Display.ProgressBar progress={progress} max={trackLength} seekTo={seek} />
                    </> : <>
                        <div id="not-playing"><i>Select your device, then begin playing to see the current track information.</i></div><br />
                    </>}
                </div>
                <div id='playback-button-wrapper'>
                    <Control.Shuffle shuffleState={shuffleState} setShuffleState={setShuffleState} />
                    <Control.PreviousSong />
                    <Control.TogglePlayback progress={progress} setProgress={setProgress} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                    <Control.NextSong />
                    <Control.Repeat repeatState={repeatState} setRepeatState={setRepeatState} />
                </div>
                <Control.Devices rawDevices={getDevices} activateDevice={transferPlayback} active={active}  />
            </div>
        </>
    )
}
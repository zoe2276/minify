import React from 'react';

export const TrackInfo = ({ contextInfo }) => {
    const [artist, setArtist] = React.useState('');
    const [track, setTrack] = React.useState('');

    React.useEffect(() => {
        try {
            setArtist(contextInfo.artists.map(a => a.name).join(' | ').trimEnd(' | '));
            setTrack(contextInfo.name);
        } catch (e) {
            console.error(e);
        }
    }, [contextInfo])

    const artistClasses = `context-artist${artist.length >= 100 ? ' text-scroll' : ''}`
    const trackClasses = `context-trackname${track.length >= 100 ? ' text-scroll-backwards' : ''}`

    return (
        <>
            <div className={artistClasses}>{artist}</div>
            <div className={trackClasses}>{track}</div>
        </>
    )
}
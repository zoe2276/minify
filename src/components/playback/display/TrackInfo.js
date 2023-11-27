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

    return (
        <>
            <div className='context-artist'>{artist}</div>
            <div className='context-trackname'>{track}</div>
        </>
    )
}
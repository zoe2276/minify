import React from 'react'
export const Art = ({ contextArtData }) => {
    // contextArtData gives us an object containing the url and dims of the image for the context (album or playlist).
    return (
        <>
            <div id='context-art'>
                <img src={contextArtData.url} height={contextArtData.height} width={contextArtData.width} alt='Art for the currently playing track' />
            </div>
        </>
    )
}
import React from 'react'
export const Art = ({ contextArtData }) => {
    // contextArtData gives us an object containing the url and dims of the image for the context (album or playlist).

    const [ew, setEw] = React.useState(0.5 * window.innerWidth);

    const styles = {
        maxWidth: contextArtData.images[0].width,
        maxHeight: contextArtData.images[0].height,
        height: ew,
        width: ew,
    }

    window.onresize = () => {
        setEw(0.5 * window.innerWidth);
    }

    return (
        <>
            <div className='context-art'>
                <img src={contextArtData.images[0].url} style={styles} height={contextArtData.images[0].height} width={contextArtData.images[0].width} alt='Art for the currently playing track' />
            </div>
        </>
    )
}
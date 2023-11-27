import React from 'react';

export const ProgressBar = ({ color = "#124812", progress, max, seekTo }) => {
    // progress should be passed as the ms returned by spotify, same with max

    const [lastSeek, setLastSeek] = React.useState(0);

    const styles = {
        background: {
            height: 20,
            // width: "100%",
            backgroundColor: "#313131",
            borderRadius: 50,
        }, progress: {
            height: "100%",
            width: `${progress * 100 / max}%`,
            backgroundColor: color,
            borderRadius: "inherit",
            textAlign: "right",
            transition: "width 500ms ease-in-out"
        }, label: {
            padding: 5,
            color: 'white',
            fontWeight: 'bold'
        }
    }

    React.useEffect(() => {
        document.getElementById('progressbar').addEventListener('click', e => {
            const relMousePos = e.offsetX;
            const elementWidth = document.getElementById('progressbar').getBoundingClientRect().width;
            const clickPosRatio = relMousePos / elementWidth;
            const newPosition = Math.floor(clickPosRatio * max);
            if (newPosition !== lastSeek) {
                // console.debug({newPosition: newPosition, lastSeek: lastSeek})
                seekTo(newPosition);
                setLastSeek(newPosition);
            } else console.debug('skipping seek request');
        })
        return () => {}
    })

    

    return (
        <>
            <div id='progressbar' className="context-progressbar-background" style={styles.background}>
                <div className="context-progressbar-progress" style={styles.progress}>
                    {/* <span className="context-progressbar-label" style={styles.label}>{`${progress}%`}</span> */}
                </div>
            </div>
        </>
    )
}
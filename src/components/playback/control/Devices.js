import React from 'react';
import { Button } from '../../../index'
export const Devices = ({ rawDevices, activateDevice, /*removeDevice, */ active }) => {
    const [options, setOptions] = React.useState()

    const getDevices = React.useCallback(() => {
        return rawDevices().then(res => {
            return res.devices.map((e, ind) => {
                if(e.name === 'minify') window.localStorage.setItem(`device_id_${ind}`, e.id)
                const buttonClasses = `device-selection-container${active === e.id ? ' active' : ''}`
                return (
                    <div className={buttonClasses} >
                        <Button text={e.name} action={() => activateDevice(e.id)} />
                        <div className='button-remove' /*onClick={removeDevice(e.id)}*/ >-</div>
                        {/* <span className='device-selection-remove'>
                            <Button text='-' action={() => removeDevice(e.id)} />
                        </span> */}
                    </div>
                )
            })
        })
    }, [rawDevices, activateDevice, active])

    // React.useEffect(() => {
    //     getDevices().then(res => {
    //         setOptions(res)
    //     })
    // }, [getDevices])

    const toggleMenu = () => {
        getDevices().then(res => {
            setOptions(res)
        })
        document.getElementById('devices-menu').classList.toggle('show')
    }

    window.onclick = e => {
        if (!e.target.matches('.devices-menu') && !e.target.matches('.button')) {
            const dropdowns = document.getElementsByClassName('devices-menu');
            for (let i = 0; i< dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }

        }
    }

    // if (options) {
        return(
            <>
                <div className='devices-menu-container'>
                    <Button text='Devices' action={() => toggleMenu()} />
                    <div className='devices-menu' id='devices-menu'>
                        {options && options}
                    </div>
                </div>
            </>
        )
    // } // else return <Loading />
}
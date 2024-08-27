import React from 'react';
import { Setting } from '../../index';

export const SettingsMenu = ({storageMethods, defaultSettings, settingsObj, setSettingsObj}) => {
    // Method to memoize the storage facade
    const updateSetting = React.useCallback((setting, value) => {
        console.debug(`updating ${setting} to ${value}`)
        let newSettings = settingsObj;
        newSettings[setting] = value;
        setSettingsObj(newSettings)
        storageMethods.set("Settings", newSettings);      
    }, [settingsObj, setSettingsObj, storageMethods]);
    
    const debugSettings = () => {
        console.debug(defaultSettings);
        console.debug(storageMethods);
        console.debug(settingsObj)
    }
    const settingsComponents = Object.keys(defaultSettings).map(elem => {
        console.debug("we are iterating...", elem)
        const normalizedSettingName = elem.split(/(?=[A-Z])/g).join(" ")
        const settingName = normalizedSettingName.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
        return (
            <div id={`settings-${elem}`} >
                <Setting 
                    label={settingName}
                    setting={elem}
                    value={storageMethods.get("Settings")[elem]}
                    type="color"
                    pushSettingChange={updateSetting}
                    reset={() => storageMethods.settings.reset(elem)} />
            </div>
        )
    })

    return (
        <>
            <div id='settings-menu-container'>
                {settingsComponents ? settingsComponents : <div id="no-settings" onClick={() => debugSettings()}>No settings found.</div>}
            </div>
        </>
    )
}
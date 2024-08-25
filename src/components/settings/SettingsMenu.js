import React from 'react';
// import { Button } from '../../index';

export const SettingsMenu = () => {
    const app = document.getElementById("app");
    const settings_background_color = document.getElementById("settings-background-color");

    settings_background_color.addEventListener("onload", e => {
        const bgcolor = settings_background_color.children[1].value;
        app.setAttribute("background-color", bgcolor);
    })

    return (
        <>
            <div id='settings-menu-container'>
                <div id='settings-background-color'>
                    <div>Background Color: </div>
                    <input type="color" />
                </div>
            </div>
        </>
    )
}
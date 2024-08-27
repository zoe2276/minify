// import logo from './logo.svg';
import * as React from "react"
import './App.css';
// import { Loading } from "./index"
import { LoginScreen, Player, SidebarMenu, SettingsMenu } from "./index"

function App() {
  const settingsProvider = () => {
    // Set up the default settings object. Needs to be in camelCase
    const defaultSettings = {
        "backgroundColor": "#000000"
    }

    // Define a storage facade for manipulating JS objects within localStorage
    const storageMethods = {
        set: (k, v) => {
            // Check for key and value in params
            if (!k || !v) {return;}
            // If it's an object, stringify it
            if (typeof v === "object") {
                v = JSON.stringify(v);
            }
            localStorage.setItem(k, v);
        }, get: k => {
            let v = localStorage.getItem(k);
            if (!v) {return false;}
            // Check if it's an object or an array, JSON style
            if (v[0] === "{" || v[0] === "[") {
                v = JSON.parse(v);
            }
            return v;
        }, assert: k => {
            // Verify if localstorage contains the key
            return localStorage.getItem(k) === null ? false : true;
        }, settings: {
            reset: (k = false) => {
                // Reset local settings to default. Defaults to all settings if no key is specified
                if (!k) {
                    localStorage.removeItem("Settings");
                    storageMethods.set("Settings", defaultSettings);
                } else {
                    // Check if the default settings have that key
                    if (defaultSettings[k]) {
                        const currentSettings = storageMethods.get("Settings");
                        const defaultValue = defaultSettings[k];
                        let newSettings = currentSettings;
                        newSettings[k] = defaultValue;
                        storageMethods.set("Settings", newSettings);
                    }
                }
            }
        }
    }
    return {
      storageMethods: storageMethods,
      defaultSettings: defaultSettings};
}

  const {storageMethods, defaultSettings} = settingsProvider();
  const [settingsObj, setSettingsObj] = React.useState(storageMethods.assert("Settings") ? storageMethods.get("Settings") : storageMethods.settings.reset())
  const [currentPage, setCurrentPage] = React.useState('login');
  const [loggedIn, setLoggedIn] = React.useState(false);
  // const version = 0.1;
  
  if (window.localStorage.getItem('access_token') && !loggedIn) setLoggedIn(true);
  if (currentPage === 'login' && loggedIn) setCurrentPage('player');
  
  return (
    <>
        <SidebarMenu setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        {currentPage === 'login' && <LoginScreen setLoggedIn={setLoggedIn} />}
        {currentPage === 'player' && <Player /> }
        {currentPage === 'settings' && <SettingsMenu 
                                        storageMethods={storageMethods}
                                        defaultSettings={defaultSettings}
                                        settingsObj={settingsObj}
                                        setSettingsObj={setSettingsObj} />}
        <br />
    </>
  );
}

export default App;

const { app, components, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            plugins: true
        }
    })
    win.loadURL("http://localhost:3000")
    // widevine testing url:
    // win.loadURL("https://shaka-player-demo.appspot.com/")
    win.webContents.openDevTools()
}

// app.commandLine.appendSwitch('widevine-cdm-path', '../cdm/linux/')
// app.commandLine.appendSwitch('widevine-cdm-path', '/nix/store/mcanzi7lsnz8gk4r50sdkqdy5k85niih-google-chrome-119.0.6045.123/share/google/chrome/WidevineCdm/_platform_specific/linux_x64/libwidevinecdm.so')
// app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2710.0')

app.whenReady().then(async () => {
  await components.whenReady();
  createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  /*
npx electron-package -download.mirrorOptions=https://github.com/castlabs/electron-releases/releases/download/v
  */
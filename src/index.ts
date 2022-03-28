import { app, BrowserWindow } from "electron"
import path from "path"

app.whenReady().then(() => {
    app.allowRendererProcessReuse = false

    // Creates the window
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    // Loads the index
    window.loadFile(path.join(__dirname, "./view/index.html"))
})
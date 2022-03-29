import { app, BrowserWindow } from "electron"
import path from "path"

const DEV_ENV = process.env.NODE_ENV == "dev"

app.whenReady().then(() => {
    app.allowRendererProcessReuse = false

    // Creates the window
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            allowRunningInsecureContent: true,
            contextIsolation: false,
            devTools: DEV_ENV,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })
    window.setMenuBarVisibility(DEV_ENV)

    // Loads the index
    window.loadFile(path.join(__dirname, "./view/index.html"))
})
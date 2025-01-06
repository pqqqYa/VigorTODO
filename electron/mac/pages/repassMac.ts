import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'
import remoteMain from '@electron/remote/main/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line node/prefer-global/process
const NODE_ENV = process.env.NODE_ENV

let repassWindow

function createRepassWindow(uname) {
  repassWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, '../../dist/logo.png'),
    vibrancy: 'menu',
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      defaultFontFamily: {
        standard: 'Helvetica',
        serif: 'Times',
        sansSerif: 'Helvetica',
        monospace: 'Menlo'
      }
    },
  })
  repassWindow.setAlwaysOnTop(true)
  if (NODE_ENV === 'development')
    repassWindow.loadURL(`http://localhost:3000/electronWindows/repass/`)
  else
    repassWindow.loadFile(path.join(__dirname, '../../dist/electronWindows/repass/index.html'))

  remoteMain.enable(repassWindow.webContents)
  repassWindow.on('ready-to-show', () => {
    repassWindow.webContents.send('getUserName', uname)
  })
  return repassWindow
}

export default createRepassWindow

import path from 'path'
import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'
import { app, ipcMain, nativeTheme } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 800,
    height: 480,
    minWidth: 300,
    minHeight: 200,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true,
    },
  })

  nativeTheme.themeSource = 'light'

  if (isProd) {
    await mainWindow.loadURL('app://./npmrc')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/npmrc`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.handle('get-current-node-version', () => {
  return process.versions.node
})

ipcMain.handle('get-home-dir', () => {
  try {
    return os.homedir()
  } catch (error) {
    return `Error: ${error.message}`
  }
})

ipcMain.handle('read-npmrc', async (_, targetPath: string) => {
  try {
    const content = fs.readFileSync(targetPath, 'utf8')
    return { success: true, content }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('write-npmrc', async (_, targetPath: string, content: string) => {
  try {
    fs.writeFileSync(targetPath, content, 'utf8')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

const runNvmCommand = (command) => {
  const nvmScript = `
    export NVM_DIR="$HOME/.nvm";
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";
    ${command}
  `
  return new Promise((resolve, reject) => {
    exec(nvmScript, { shell: '/bin/bash' }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

const runOpenTerminalCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(
      `osascript -e 'tell application "Terminal" to do script "${command}"'`,
      { shell: '/bin/bash' },
      (error, stdout, stderr) => {
        if (error) {
          console.log(error, stderr)
          reject(stderr || error.message)
        } else {
          resolve(stdout.trim())
        }
      }
    )
  })
}

ipcMain.handle('open-terminal', async (event, command) => {
  try {
    const result = await runOpenTerminalCommand(command)
    return result
  } catch (error) {
    throw error.message
  }
})

ipcMain.handle('nvm-command', async (event, command) => {
  try {
    const result = await runNvmCommand(command)
    return result
  } catch (error) {
    throw error.message
  }
})

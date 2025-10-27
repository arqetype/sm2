import { BrowserWindow, shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'node:path';
import { WINDOW_CONFIG } from '../config/app';

export let mainWindow: BrowserWindow;

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_CONFIG.DEFAULT_WIDTH,
    height: WINDOW_CONFIG.DEFAULT_HEIGHT,
    minWidth: WINDOW_CONFIG.MIN_WIDTH,
    minHeight: WINDOW_CONFIG.MIN_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'under-window',
    frame: false,
    visualEffectState: 'followWindow',
    roundedCorners: true,
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    trafficLightPosition: { x: 12, y: 14 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    void shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

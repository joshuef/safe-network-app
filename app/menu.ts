import { app, Menu, shell } from 'electron';
import { Application } from './definitions/application.d';

export class MenuBuilder {
    private mainWindow: Application.Window;

    public constructor( mainWindow: Application.Window ) {
        this.mainWindow = mainWindow;
    }

    public buildMenu(): Menu {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            this.setupDevelopmentEnvironment();
        }

        let template: Array<{}>;

        if ( process.platform === 'darwin' ) {
            template = this.buildDarwinTemplate();
        } else {
            template = this.buildDefaultTemplate();
        }

        const menu = Menu.buildFromTemplate( template );
        Menu.setApplicationMenu( menu );

        return menu;
    }

    private setupDevelopmentEnvironment(): void {
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on( 'context-menu', ( _event, properties ) => {
            const { x, y } = properties;

            Menu.buildFromTemplate( [
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement( x, y );
                    }
                }
            ] ).popup( { window: this.mainWindow } );
        } );
    }

    private buildDarwinTemplate(): Array<{}> {
        const subMenuAbout = {
            label: 'Electron',
            submenu: [
                {
                    label: 'About ElectronReact',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: 'Hide ElectronReact',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        };
        const subMenuEdit = {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                }
            ]
        };
        const subMenuViewDevelopment = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuViewProduction = {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    }
                }
            ]
        };
        const subMenuWindow = {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' }
            ]
        };
        const subMenuHelp = {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        shell.openExternal( 'http://electron.atom.io' );
                    }
                },
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal(
                            'https://github.com/atom/electron/tree/master/docs#readme'
                        );
                    }
                },
                {
                    label: 'Community Discussions',
                    click() {
                        shell.openExternal(
                            'https://discuss.atom.io/c/electron'
                        );
                    }
                },
                {
                    label: 'Search Issues',
                    click() {
                        shell.openExternal(
                            'https://github.com/atom/electron/issues'
                        );
                    }
                }
            ]
        };

        const subMenuView =
            process.env.NODE_ENV === 'development'
                ? subMenuViewDevelopment
                : subMenuViewProduction;

        return [
            subMenuAbout,
            subMenuEdit,
            subMenuView,
            subMenuWindow,
            subMenuHelp
        ];
    }

    private buildDefaultTemplate(): Array<{}> {
        const templateDefault = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O'
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click: () => {
                            this.mainWindow.close();
                        }
                    }
                ]
            },
            {
                label: '&View',
                submenu:
                    process.env.NODE_ENV === 'development'
                        ? [
                            {
                                label: '&Reload',
                                accelerator: 'Ctrl+R',
                                click: () => {
                                    this.mainWindow.webContents.reload();
                                }
                            },
                            {
                                label: 'Toggle &Full Screen',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                }
                            },
                            {
                                label: 'Toggle &Developer Tools',
                                accelerator: 'Alt+Ctrl+I',
                                click: () => {
                                    this.mainWindow.toggleDevTools();
                                }
                            }
                        ]
                        : [
                            {
                                label: 'Toggle &Full Screen',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                }
                            }
                        ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal( 'http://electron.atom.io' );
                        }
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal(
                                'https://github.com/atom/electron/tree/master/docs#readme'
                            );
                        }
                    },
                    {
                        label: 'Community Discussions',
                        click() {
                            shell.openExternal(
                                'https://discuss.atom.io/c/electron'
                            );
                        }
                    },
                    {
                        label: 'Search Issues',
                        click() {
                            shell.openExternal(
                                'https://github.com/atom/electron/issues'
                            );
                        }
                    }
                ]
            }
        ];

        return templateDefault;
    }
}
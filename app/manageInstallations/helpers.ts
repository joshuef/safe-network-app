import path from 'path';
import { execSync } from 'child_process';
import { Store } from 'redux';
import fs from 'fs-extra';

import {
    RELEASE_CHANNEL,
    BETA,
    ALPHA,
    MAC_OS,
    LINUX,
    WINDOWS,
    platform,
    isRunningOnWindows,
    isRunningOnLinux,
    isRunningTestCafeProcess
} from '$Constants';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';
import { capitalize } from '$Utils/capitalize';
import { setCurrentVersion } from '$Actions/application_actions';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

export const delay = ( time: number ): Promise<void> =>
    new Promise(
        ( resolve ): ReturnType<typeof setTimeout> => setTimeout( resolve, time )
    );

const getLocalLinuxAppImageName = ( application ) => {
    const appPackageNameForChannel = `'${application.packageName ||
        application.name}-v*${RELEASE_CHANNEL}*'`;

    const commandArguments = [
        INSTALL_TARGET_DIR,
        '-name',
        appPackageNameForChannel
    ];

    logger.verbose(
        'Attempting to locate an installed linux version via:',
        'find',
        ...commandArguments
    );
    let installedApp = '';

    try {
        installedApp = execSync(
            `find ${INSTALL_TARGET_DIR} -name ${appPackageNameForChannel}`,
            {
                encoding: 'utf-8'
            }
        );
    } catch ( error ) {
        logger.error( 'Error checking for local linux appImage', error );
    }

    return installedApp;
};

export const getApplicationExecutable = (
    application: App,
    getCurrentVersion?: boolean
): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.

    let applicationExecutable: string;
    const appModifier = RELEASE_CHANNEL
        ? ` ${capitalize( RELEASE_CHANNEL )}`
        : '';

    switch ( platform ) {
        case MAC_OS: {
            applicationExecutable = `${application.name ||
                application.packageName}${appModifier}.app`;
            break;
        }
        case WINDOWS: {
            applicationExecutable = path.join(
                `${application.name}`,
                `${application.name ||
                    application.packageName}${appModifier}.exe`
            );
            break;
        }
        case LINUX: {
            const targetVersion = getCurrentVersion
                ? application.currentVersion
                : application.latestVersion;
            applicationExecutable = `${application.packageName ||
                application.name}-${targetVersion}-linux-x64.AppImage`;

            logger.verbose( 'Target version of app exec', targetVersion );
            if ( getCurrentVersion && !targetVersion ) {
                try {
                    const installedApp = getLocalLinuxAppImageName( application );

                    if ( installedApp.length > 0 ) {
                        logger.info(
                            'Installed linux version found: ',
                            installedApp
                        );
                        applicationExecutable = path.basename( installedApp );
                    }
                } catch ( error ) {
                    logger.error(
                        'Error checking for installed linux version:',
                        error
                    );
                }
            }

            break;
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
    logger.verbose( 'Executable is called: ', applicationExecutable );
    return applicationExecutable;
};

export const getInstalledLocation = ( application: App ): string => {
    const getCurrentVersion = true;
    const applicationExecutable = getApplicationExecutable(
        application,
        getCurrentVersion
    );
    const installedPath = path.join( INSTALL_TARGET_DIR, applicationExecutable );

    return installedPath;
};

export const checkIfAppIsInstalledLocally = async (
    application
): Promise<boolean> => {
    const getCurrentVersion = true;

    const applicationExecutable = getApplicationExecutable(
        application,
        getCurrentVersion
    );

    const installedPath = getInstalledLocation( application );

    const exists = await fs.pathExists( installedPath );

    logger.info( 'Checking if path exists', installedPath, exists );

    return exists;
};

export const getLocalAppVersion = ( application, store: Store ): string => {
    logger.info( 'Checking locally installed version file' );

    let localVersion: string;

    if ( isRunningOnLinux ) {
        const installedApp = getLocalLinuxAppImageName( application );
        logger.verbose( 'Installed linux found: ', installedApp );

        if ( installedApp ) {
            const semvarRegex = /(\d+\.)(\d+\.)(\d+)(-alpha|-beta)?(\.\d+)?/g;

            localVersion = semvarRegex.exec( installedApp )[0] || null; // 0 is full match
        }
    } else {
        try {
            // const appContainingFolder = `'${application.name} ${capitalize(RELEASE_CHANNEL)}'`;

            // default to MacOs
            let versionFilePath = path.resolve(
                getInstalledLocation( application ),
                'Contents/Resources/version'
            );

            if ( isRunningOnWindows ) {
                versionFilePath = path.resolve(
                    INSTALL_TARGET_DIR,
                    getInstalledLocation( application ),
                    '..',
                    'version'
                );
            }
            logger.verbose(
                'locally installed version file location to check: ',
                versionFilePath
            );

            if ( fs.pathExistsSync( versionFilePath ) ) {
                localVersion = fs.readFileSync( versionFilePath ).toString();
            } else {
                logger.warn(
                    'Version file was not found. This may be due to an update in progress...'
                );
                localVersion = null;
            }
        } catch ( error ) {
            logger.error( 'Error grabbing local app version', error );
        }
    }

    if ( !localVersion || localVersion.length === 0 ) {
        logger.info( 'No local version found' );

        return null;
    }

    if ( !localVersion.startsWith( 'v' ) ) {
        localVersion = `v${localVersion}`;
    }

    logger.info( 'Version found was: ', localVersion );

    store.dispatch(
        setCurrentVersion( {
            ...application,
            currentVersion: localVersion
        } )
    );

    return localVersion;
};

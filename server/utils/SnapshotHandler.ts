//Utils:
import { loadSnapshotState, saveSnapshotState } from './SettingsStorage';
import { 
    mixerProtocolPresets,
} from '../mainClasses'
import { state } from '../reducers/store'
import { logger } from './logger';

const path = require('path')
export class SnapshotHandler {
    numberOfChannels: number[] = []
    settingsPath: string = ''

    constructor() {
        logger.info('SETTINGS UP STATE', {})

        this.snapShopStoreTimer();

        // Count total number of channels:
        mixerProtocolPresets[state.settings[0].mixerProtocol].channelTypes.forEach((item: any, index: number) => {
            this.numberOfChannels.push(state.settings[0].numberOfChannelsInType[index]);
        });
        this.loadSnapshotSettings(path.resolve('storage', 'default.shot'), true)

        // ** UNCOMMENT TO DUMP A FULL STORE:
        //const fs = require('fs')
        //fs.writeFileSync('src/components/__tests__/__mocks__/parsedFullStore-UPDATE.json', JSON.stringify(global.storeRedux.getState()))

    }

    snapShopStoreTimer() {
        const saveTimer = setInterval(() => {
                let snapshot = {
                    faderState: state.faders[0],
                    channelState: state.channels[0]
                }
                saveSnapshotState(snapshot, path.resolve(this.settingsPath, 'storage', 'default.shot'))
            },
            2000);
    }

    loadSnapshotSettings(fileName: string, loadAll: boolean) {
        loadSnapshotState(
            state.faders[0],
            state.channels[0],
            this.numberOfChannels,
            state.settings[0].numberOfFaders,
            fileName,
            loadAll
        );
    }

    saveSnapshotSettings(fileName: string) {
        let snapshot = {
            faderState: state.faders[0],
            channelState: state.channels[0]
        }
        saveSnapshotState(snapshot, fileName);
    }
}
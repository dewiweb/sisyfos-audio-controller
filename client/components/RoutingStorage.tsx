import React from 'react';

import '../assets/css/RoutingStorage.css';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { TOGGLE_SHOW_STORAGE } from '../../server/reducers/settingsActions'
import { 
    SOCKET_GET_SNAPSHOT_LIST, 
    SOCKET_LOAD_SNAPSHOT, 
    SOCKET_SAVE_SNAPSHOT,
    SOCKET_GET_CCG_LIST, 
    SOCKET_SAVE_CCG_FILE
} from '../../server/constants/SOCKET_IO_DISPATCHERS';

interface IStorageProps {
    load: any
    save: any
}
class Storage extends React.PureComponent<IStorageProps & Store> {
    fileList: string[] = []
    loadSnapshot: any
    saveSnapshot: any

    constructor(props: any) {
        super(props);
        this.loadSnapshot = this.props.load
        this.saveSnapshot = this.props.save

        //Bindings:
        this.ListSnapshotFiles = this.ListSnapshotFiles.bind(this)
        this.ListCcgFiles = this.ListCcgFiles.bind(this)
        this.loadFile = this.loadFile.bind(this)
        this.saveFile = this.saveFile.bind(this)
    }

	handleClose = () => {
		this.props.dispatch({
			type: TOGGLE_SHOW_STORAGE
		});
    }
    
    saveFile() {
        let fileName = window.prompt('Enter filename :', 'newfile')
        if (window.confirm('Are you sure you will save ' + fileName + ' as new routing setup?'))
        {
            console.log('Saving file')
            window.socketIoClient.emit(SOCKET_SAVE_SNAPSHOT, fileName + '.shot')
        }
        this.handleClose()
    }

    loadFile(event: any) {
        if (window.confirm('Are you sure you will load a new routing setup?'))
        {
            console.log('Loading files')
            window.socketIoClient.emit(SOCKET_LOAD_SNAPSHOT, event.target.textContent)
        }
        this.handleClose()
    }
    loadCcgFile(event: any) {
        if (window.confirm('Are you sure you will load a CasparCG setup?'))
        {
            console.log('Setting default CasparCG file')
            window.socketIoClient.emit(SOCKET_SAVE_CCG_FILE, event.target.textContent)
        }
        this.handleClose()
    }


    ListSnapshotFiles() {
        window.socketIoClient.emit(SOCKET_GET_SNAPSHOT_LIST)
        const listItems = window.snapshotFileList.map((file: string, index: number) => {
            return (
                <li key={index} onClick={this.loadFile} className="item">
                {file}
                </li>)
            });
        return (
          <ul className="storage-list">
            {listItems}
            </ul>
        );
    }

    ListCcgFiles() {
        window.socketIoClient.emit(SOCKET_GET_CCG_LIST)
        const listItems = window.ccgFileList.map((file: string, index: number) => {
            return (
                <li key={index} onClick={this.loadCcgFile} className="item">
                    {file}
                </li>
            )
        })
        return (
            <ul className="storage-list">
              {listItems}
              </ul>
        )
    }

    render() {
        return (
            <div className="channel-storage-body">
                <button className="close" onClick={() => this.handleClose()}>X</button>
                <h2>STORAGE</h2>
                <br/>
                <h3>SAVE ROUTING :</h3>
                <button onClick={this.saveFile} className="button">
                    SAVE
                </button>
                <hr/>
                <h3>LOAD ROUTING :</h3>
                <this.ListSnapshotFiles/>
                {window.ccgFileList.length > 0 ?
                    <div>
                        <hr/>
                        <h3>LOAD CASPARCG :</h3>
                        <this.ListCcgFiles/>
                    </div> 
                    : null
                }
            </div>
        )
    }

}

const mapStateToProps = (state: any, props: any): any => {
    return {
        load: props.load,
        save: props.save
    }
}

export default connect<any>(mapStateToProps)(Storage) as any;

import {useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "./actions/fileActions";


const  columnDefs=  [
    { field: "id", checkboxSelection: true, filter: "agNumberColumnFilter" },
    { field: "file", filter: "agTextColumnFilter" },
    { field: "size", filter: "agNumberColumnFilter" }
  ];
const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
}

const FileView = (props) => {
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const onGridReady = params => {
        setGridApi(params.api)
        setColumnApi(params.columnApi);
        params.api.sizeColumnsToFit()
    }

    const addSize = () => {
        props.actions.addSize();
    };
      
    const randomSize = () => {
         props.actions.randomSize();
    };
      
    const newFile = () => {
        props.actions.newFile();
    };
    
    const deleteFiles = () => {
        let ids = [];
        gridApi.forEachNode(node => {
        if (node.isSelected()) {
            ids.push(node.data.id);
        }
    });
        props.actions.deleteFiles(ids);
    };
    
    return (
        <div id="myGrid" style={{ height: 450 }} className="ag-theme-balham">
        <button onClick={() => addSize()}>Add 1 Size to Even Ids</button>
        <button onClick={() => randomSize()}>Randomize Sizes</button>
        <button onClick={() => newFile()}>Add File</button>
        <button onClick={() => deleteFiles()}>Delete Files</button>
        <AgGridReact
         rowData={props.files}
         deltaRowMode={true}
         getRowNodeId={data => data.id}
         columnDefs={columnDefs}
         onGridReady={onGridReady}
         defaultColDef={defaultColDef}
         rowSelection={"multiple"}
        ></AgGridReact>
      </div>
    )
}


const mapStateToProps = state => ({ files: state.files });

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileView);

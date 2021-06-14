import {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import NameFieldComponent from './NameFieldComponent'

const  columnDefs=  [
  { headerName: "Name", field: "name", cellRenderer: "nameFieldComponent" },
  { headerName: "Street", field: "address.street1" },
  { headerName: "City", field: "address.city" },
  { headerName: "State", field: "address.state" },
  {
    headerName: "Address",
    valueGetter: ({ data }) =>
       `${data.address.street1} ${data.address.city}, ${data.address.state} ${data.address.zip}`
  },
  {
    headerName: "Avatar",
    field: "avatar",
    width: 100,
    cellRenderer: ({ value }) => `<img style="height: 14px; width: 14px" src=${value} />`
   }
];
const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true
}




function App() {

  const frameworkComponents = {
    'nameFieldComponent': NameFieldComponent    
  };

  console.log("AgGridWithUseState Render");
 
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [modelVisibility, setModelVisibility] = useState(true);

  const onGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };

    fetch('http://localhost:3001/api/customers')
    .then(res => res.json()).then(rowData => updateData(rowData))
    params.api.sizeColumnsToFit();
  }


  const onButtonClick = () =>{
  
    const selectedNodes = gridApi.getSelectedRows()
    const selectedDataString = selectedNodes
      .map(node => `${node.athlete} - ${node.age}`)
      .join(', ');
    alert(`Selected Nodes: ${selectedDataString}`);
  }

  const toggleModel = () => setModelVisibility(!modelVisibility)

  useEffect(() => {
    
    if(columnApi){
      columnApi.setColumnVisible('age', modelVisibility)
    }
  
    return () => {
      'component unmounted'
    }
  }, [modelVisibility, columnApi])

  console.log(modelVisibility, "modelVisibility")
  return (
    <div
        className="ag-theme-balham"
        style={{
          height: '800px'
        }}
      >

      <button type="button" onClick={toggleModel}>
        Toggle Model Column
      </button>
        <button type="button" onClick={onButtonClick}>
          Selected Rows
      </button>
         <AgGridReact
          rowSelection={'multiple'}
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
        >
        </AgGridReact>
    </div>
  );
}

export default App;

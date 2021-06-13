import {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const  columnDefs=  [
  {
    headerName: 'Athlete',
    field: 'athlete',
    sortable: true,
    filter: true,
    checkboxSelection: true
  },
  {
    headerName: 'Age',
    field: 'age',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Country',
    field: 'country',
    sortable: true,
    filter: true
  }
];

function App() {

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

    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json')
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
          height: '500px',
          width: '600px'
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
        ></AgGridReact>
    </div>
  );
}

export default App;

import {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const  columnDefs=  [
  {
    headerName: "ID",
    width: 50,
    valueGetter: "node.id",
    cellRenderer: "loadingRenderer"
  },
  {
    headerName: "Athlete",
    field: "athlete",
    width: 150
  },
  {
    headerName: "Age",
    field: "age",
    width: 90
  },
  {
    headerName: "Country",
    field: "country",
    width: 120
  },
  {
    headerName: "Year",
    field: "year",
    width: 90
  },
  {
    headerName: "Date",
    field: "date",
    width: 110
  },
  {
    headerName: "Sport",
    field: "sport",
    width: 110
  },
  {
    headerName: "Gold",
    field: "gold",
    width: 100
  },
  {
    headerName: "Silver",
    field: "silver",
    width: 100
  },
  {
    headerName: "Bronze",
    field: "bronze",
    width: 100
  },
  {
    headerName: "Total",
    field: "total",
    width: 100
  }
];
const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true
}

const components = {
  loadingRenderer: function(params) {
    if (params.value !== undefined) {
      return params.value;
    } else {
      return '<img src="./loading.gif">';
    }
  }
}


function App() {
  console.log("AgGridWithUseState Render");
 
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [modelVisibility, setModelVisibility] = useState(true);

  const onGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi);

    // const updateData = (data) => {
    //   setRowData(data);
    // };

    const updateData = (data) => {
      var dataSource = {
        rowCount: null,
        getRows: function (params) {
          console.log('data row from ' + params.startRow + ' to ' + params.endRow);
          setTimeout(function () {
            var rowsThisPage = data.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (data.length <= params.endRow) {
              lastRow = data.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 500);
        },
      };
      params.api.setDatasource(dataSource);
    };

    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json')
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
          components={components}
          rowBuffer={0}
          rowModelType={'infinite'}
          paginationPageSize={100}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1000}
          maxBlocksInCache={10}
        >
        </AgGridReact>
    </div>
  );
}

export default App;

import {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const  columnDefs=  [
  {
    headerName: "Personal Information",
   groupId: "PersonalGroup",
   children: [
      {
      headerName: "ID",
      valueGetter: "node.id",
      cellRenderer: "loadingRenderer",
      lockPosition: true 
      },
      {
      headerName: "Athlete",
      field: "athlete",
      colId: "athlete",
      lockPinned: true
      },
      {
      headerName: "Age",
      field: "age",
      colId: "age",
      columnGroupShow: "open"
      },
      {
        headerName: "Country",
        field: "country",
        headerTooltip: "Player Country",
        columnGroupShow: "open"
      },
    ]
  },
  {
    headerName: "Score Information",
    groupId: "ScoreInfo",
    marryChildren: true,
    children: [
      {
        headerName: "Year",
        field: "year"
      },
      {
        headerName: "Date",
        field: "date"
      },
      {
        headerName: "Sport",
        field: "sport"
      },
      {
        headerName: "Gold",
        field: "gold"
      },
      {
        headerName: "Silver",
        field: "silver",
        columnGroupShow: "open"
      },
      {
        headerName: "Bronze",
        field: "bronze",
        columnGroupShow: "open"
      },
      {
        headerName: "Total",
        field: "total",
        columnGroupShow: "open"
      }
    ]
  },
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


  const toggleExpansion = expand => {
    let groupNames = ["PersonalGroup", "ScoreInfo"];
    groupNames.forEach(groupId => {
      columnApi.setColumnGroupOpened(groupId, expand);
    });
  };

  const onGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi);

    let columnIds = [];
    console.log(params.columnApi)
    params.columnApi.getAllColumns().forEach(column => {
      columnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(columnIds);

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
      <button type="button" onClick={() => toggleExpansion(true)}>
          Expand All
      </button>
      <button type="button" onClick={() => toggleExpansion(false)}>
          Collapse All
      </button>
      <button
        type="button"
        onClick={() => columnApi.setColumnPinned("athlete", "left")}
      >
        Pin Athlete Name to Left
      </button>

      <button
        type="button"
        onClick={() => columnApi.setColumnPinned("athlete", null)}
        >
        Unpin Athlete Name
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
          colResizeDefault={'shift'}
        >
        </AgGridReact>
    </div>
  );
}

export default App;

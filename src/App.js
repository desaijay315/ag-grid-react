import {useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise'


//agTextColumnFilter is a filter options provided by the ag-grid

const  columnDefs=  [
  {
    headerName: "ID",
    field: "id",
    width: 60,
    lockPosition: true
  },
  {
    headerName: "First",
    field: "firstName"
  },
  {
    headerName: "Last",
    field: "lastName",
    sortable: true,
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains", "notContains"],
        suppressAndOrCondition: true
    },
    floatingFilter: true
  },
  {
    headerName: "Acct #",
    field: "accountNumber"
  },
  {
    headerName: "Acct Name",
    field: "accountName",
    filter: "agSetColumnFilter"
  },
  {
    headerName: "Date Opened",
    field: "dateOpened",
    sortable: true,
    filter: "agDateColumnFilter",
    filterParams: {
      comparator: function(filterLocalDateAtMidnight, cellValue) {
         if (cellValue === null) return -1;
         let cellDate = new Date(cellValue);
         if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
           return 0;
         }
        if (cellDate < filterLocalDateAtMidnight) {
            return -1;
        }
       if (cellDate > filterLocalDateAtMidnight) {
           return 1;
       }
    },
     browserDatePicker: true
  },
    floatingFilter: true
  },
  {
    headerName: "Amount",
    field: "amount",
    sortable: true,
    filter: "agNumberColumnFilter",
    filterParams: {
      defaultOption: "inRange",
      inRangeInclusive: true,
      applyButton: true
    },
    valueFormatter: function(params) {
    //  console.log(parseFloat(params.value).toFixed(2))
      return parseFloat(params.value).toFixed(2);
    },
    floatingFilter: true
  }
];

const defaultColDef = {
  resizable: true
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
 
  const [rowData, setRowData] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  const onGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };


    fetch("http://localhost:3001/api/accounts")
      .then(result => result.json())
      .then(rowData => updateData(rowData));

    params.api.sizeColumnsToFit();
  }

  const handleQuickFilter = (event) =>{
    gridApi.setQuickFilter(event.target.value);
  }

  const checkingAndSavings = () => {
    const accountNameFilter = gridApi.getFilterInstance("accountName");
    accountNameFilter.selectNothing();
    accountNameFilter.selectValue("Checking Account");
    accountNameFilter.selectValue("Savings Account");
    accountNameFilter.applyModel();
    gridApi.setSortModel([{ colId: "lastName", sort: "asc" }]);
    gridApi.onFilterChanged();
  }

  const clearFilters = () => {
    gridApi.setFilterModel(null);
  };

  const moFilter = () =>{
    // get the instance of the filter on each column
    const lastNameFilter = gridApi.getFilterInstance("lastName");
    const amountFilter = gridApi.getFilterInstance("amount");
    // set the filter model
    lastNameFilter.setModel({
      type: "contains",
      filter: "Mo"
    });
    amountFilter.setModel({
      type: "lessThan",
      filter: 100
    });
    // sort the grid
    gridApi.setSortModel([{ colId: "amount", sort: "desc" }]);
    // tell ag-Grid to update the filters
    gridApi.onFilterChanged();
  }

  return (
    <div
        className="ag-theme-balham"
        style={{ height: "450px", width: "100%" }}
      >
        <input
          type="text"
          placeholder="Quick Filter"
          onChange={handleQuickFilter}
        />
        <button type="button" onClick={moFilter}>
          Mo Filter
        </button>
        <button type="button" onClick={checkingAndSavings}>
          Checking and Savings
        </button>
        <button onClick={() => clearFilters()}>Reset Filters</button>

         <AgGridReact
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          pagination={true}
        >
        </AgGridReact>
    </div>
  );
}

export default App;
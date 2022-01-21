import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchBar from "material-ui-search-bar";
import "./table.css";

const Table = ({ data }) => {
  //columns are hardcoded while rows are dynamically generated
  const [columns] = useState([
    { field: "index", headerName: "Index", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "availability",
      headerName: "Availability",
      width: 150,
    },
    {
      field: "needingRepair",
      headerName: "Need To Repair",
      width: 200,
    },
    {
      field: "durability",
      headerName: "Durability",
      width: 140,
    },
    {
      field: "mileage",
      headerName: "Mileage",
      width: 140,
    },
  ]);

  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  useEffect(() => {
    setRows(data);
    setOriginalRows(data);
  }, [data]);

  const [searched, setSearched] = useState("");
  const requestSearch = (searchedVal) => {
    const filteredRows = originalRows.filter((row) => {
      return row.name.toLowerCase().match(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  return (
    <div style={{ height: 448, width: "100%" }}>
      <SearchBar
        className="search-bar"
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={6}
        rowsPerPageOptions={[6]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default Table;

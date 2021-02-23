import { React, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import Row from "./components/Row";
import "./css/style.css";
import SearchBar from "material-ui-search-bar";
import fetch from "node-fetch";
import LoadingOverlay from "react-loading-overlay";
import { RotateLoader } from "react-spinners";

export default function CollapsibleTable() {
  const [leads, setLeads] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return fetch("http://localhost:2000/api/leads", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => saveData(data));
  }, []);

  const saveData = (data) => {
    setLeads(data);
    setRows(data);
    setLoading(false);
    console.log(data);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = leads.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase().trim());
    });

    searchedVal.trim().length == 0 ? setRows(leads) : setRows(filteredRows);
  };

  return (
    <>
      <LoadingOverlay
        active={loading}
        spinner={<RotateLoader color="white" />}
      ></LoadingOverlay>
      <TableContainer className="tableContainer" variant="outlined">
        <div className="tableheader">
          <Typography variant="h5" className="titleCell" gutterBottom>
            Таблица с результатами
          </Typography>
          <SearchBar
            className="searchCell"
            placeholder="Поиск сделок"
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => setRows(leads)}
          />
        </div>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Название</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Ответственный</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Бюджет</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((items, i) => (
              <Row data={items} key={i} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

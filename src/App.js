import { React, useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import "./css/style.css";
import { Avatar, Typography, Chip, Link } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import fetch from "node-fetch";
import LoadingOverlay from "react-loading-overlay";
import { RotateLoader } from "react-spinners";

function Row(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th">
          {props.data.name}&nbsp;&nbsp;
          {props.data.tags.length == 0
            ? null
            : props.data.tags.map((item) => {
                return (
                  <Chip
                    label={item.name}
                    size="small"
                    variant="outlined"
                    style={{ marginRight: "2px" }}
                  />
                );
              })}
        </TableCell>

        <TableCell>
          <Chip
            label={props.data.status.name}
            size="small"
            variant="outlined"
            className="statusIcon"
            style={{ backgroundColor: props.data.status.color }}
          />
        </TableCell>
        <TableCell>
          <Chip
            avatar={
              <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_-VaReqJkWoomHMkAKDcthm_jMAq0mTSXpg&usqp=CAU" />
            }
            className="avatarLabel"
            label={props.data.responsible}
            size="medium"
          />
        </TableCell>
        <TableCell>{props.data.created}</TableCell>
        <TableCell>{props.data.budget} ₽</TableCell>
      </TableRow>

      <TableRow className="contactBlock">
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: "5rem" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {props.data.contacts.map((client, i) => (
                    <div>
                      <Chip
                        avatar={
                          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_-VaReqJkWoomHMkAKDcthm_jMAq0mTSXpg&usqp=CAU" />
                        }
                        className="avatarLabel"
                        label={client.name}
                      />

                      {client.info.map((i) => {
                        return (
                          <>
                            | &nbsp;
                            {i.contact == "PHONE" ? (
                              <Link href={"tel:" + i.contactValue}>
                                <PhoneIcon className="contactIcon" />
                              </Link>
                            ) : null}
                            {i.contact == "EMAIL" ? (
                              <Link href={"mailto:" + i.contactValue}>
                                <EmailIcon className="contactIcon" />
                              </Link>
                            ) : null}
                            &nbsp;
                          </>
                        );
                      })}
                      <br />
                    </div>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

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

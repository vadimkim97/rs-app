import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Avatar,
  Chip,
  Link,
} from "@material-ui/core";
import "../css/style.css";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Phone,
  Email,
} from "@material-ui/icons";
import { useState } from "react";

export default function Row(props) {
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
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th">
          {props.data.name}&nbsp;&nbsp;
          {props.data.tags.length == 0
            ? null
            : props.data.tags.map((item, i) => {
                return (
                  <Chip
                    key={i}
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
              {props.data.contacts.map((client, i) => (
                <Box key={i}>
                  <Chip
                    avatar={
                      <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_-VaReqJkWoomHMkAKDcthm_jMAq0mTSXpg&usqp=CAU" />
                    }
                    className="avatarLabel"
                    label={client.name}
                  />

                  {client.info.map((i, key) => {
                    return (
                      <>
                        | &nbsp;
                        {i.contact == "PHONE" ? (
                          <Link href={"tel:" + i.contactValue}>
                            <Phone className="contactIcon" />
                          </Link>
                        ) : null}
                        {i.contact == "EMAIL" ? (
                          <Link href={"mailto:" + i.contactValue}>
                            <Email className="contactIcon" />
                          </Link>
                        ) : null}
                        &nbsp;
                      </>
                    );
                  })}
                  <br />
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

import React from 'react';
import OverflowMenu from '../OverflowMenu';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';


import "./index.css";

// Represents a row within a ResourceIndexTable
const ResourceIndexItem = (props) => {
  // Loop through each of the entries in the parent table's columns list returned by the provided getColumns prop.
  // Each entry will be an object which looks something like: {field: "selectbox", type: "selectbox", html_text: ""}
  // Each iteration of this loop will match a key of the columns to a key in the data prop, and use those to populate a single cell within the row

  let cells = props.getColumns().map((column) => {
    let cell;
      switch(column.type) {
        case 'selectbox':
          cell = <TableCell key={column.field} padding="checkbox">
                  <Checkbox
                     name={props.data.name+"-selectbox"}
                     checked={props.selected}
                     onChange={(event, key) => props.selectItemCallback(event, props.data.name)} // when checked, will trigger the function passed in props.selected, usually with the end result of adding this item's firebase primary key
                  />
                </TableCell>;
          break;
        case 'overflow-menu':
          // Needs to be established
          cell = <TableCell key={column.field}>
                  <OverflowMenu key={column.field}
                                items={props.data[column.field].overflow_items} //requires that the props.data[column.field] returns an object with a defined overflow_items key
                  />
                 </TableCell>;
          break;
        case 'drop-down-parent':
        case 'text':
        default:
          cell = <TableCell key={column.field}>{props.data[column.field] || ""}</TableCell>;
      }
      return cell;
  });

  return(
    <TableRow>
      {cells}
    </TableRow>
  );
}

export default ResourceIndexItem;

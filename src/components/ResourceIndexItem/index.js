import React, {useState} from 'react';
import OverflowMenu from '../OverflowMenu';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import "./index.css";

// Represents a row within a ResourceIndexTable
const ResourceIndexItem = (props) => {
  // Loop through each of the entries in the parent table's columns list returned by the provided getColumns prop.
  // Each entry will be an object which looks something like: {field: "selectbox", type: "selectbox", html_text: ""}
  // Each iteration of this loop will match a key of the columns to a key in the data prop, and use those to populate a single cell within the row
  const [rowOptions, setRowOptions] = useState(props.options);

  // go through each column first and initialize its corresponding options
  let init_options = {};
  props.getColumns().forEach(column => {
    init_options[column.field] = props.data[column.field] ? props.data[column.field] : {};
  });
  const [columnOptions, setColumnOptions] = useState(init_options);


  const dropDownParentSelector = (column_field) => {
    let options_copy = Object.assign({}, columnOptions);
    options_copy[column_field].open = !options_copy[column_field].open;

    setColumnOptions(options_copy);
  }

  let cells = props.getColumns().map((column) => {
    let cell_data = props.data[column.field];
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
      // Requires an overflow_items field in the value which matches the passed column key
      case 'overflow-menu':
        cell = <TableCell key={column.field}>
                  <OverflowMenu key={column.field}
                                items={cell_data.overflow_items} //requires that the props.data[column.field] returns an object with a defined overflow_items key
                  />
               </TableCell>;
        break;
      // Requires an options field for passing children
      case 'drop-down-parent':
        // Because drop-down-parent expects options (including what is contained by the drop down), it will store each column's options (where required) in the state hook object with key = column.field
        console.log(columnOptions);
        cell = <TableCell key={column.field}>
                  <IconButton aria-label="expand row" size="small" onClick={() => {dropDownParentSelector(column.field)}}>
                    {columnOptions[column.field].open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </IconButton>
                  {cell_data.html_text || ""}
               </TableCell>;
        break;
      case 'text':
      default:
        cell = <TableCell key={column.field}>{cell_data || ""}</TableCell>;
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

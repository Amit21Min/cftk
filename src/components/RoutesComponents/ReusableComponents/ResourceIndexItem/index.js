import React, {useState} from 'react';
import OverflowMenu from '../../OverflowMenu';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { display } from '@material-ui/system';

// Is used to handle complex behavior in components passed to a drop-down
import ComponentTransporter from '../ComponentTransporter';

import "./index.css";

// Represents a row within a ResourceIndexTable
const ResourceIndexItem = (props) => {

  const [rowOptions, setRowOptions] = useState(props.options);

  // go through each column first and initialize its corresponding options (like open in the case of drop-down-parents)
  let init_options = {};
  props.columns.forEach(column => {
    init_options[column.field] = props.data[column.field] ? props.data[column.field] : {};
  });
  const [cellOptions, setCellOptions] = useState(init_options);

  // Utility method to toggle the visibility of drop-down content belonging to a given column
  const dropDownParentSelector = (column_field) => {
    let options_copy = Object.assign({}, cellOptions);
    options_copy[column_field].open = !options_copy[column_field].open;
    setCellOptions(options_copy);
  }

  // Looks at the selected_items list stored in the select-box column for selected items
  const getSelectedStatus = (column, key) => column.selected_items.indexOf(key) !== -1;

  let expanded_rows = [];

  // Loop through each of the entries in the parent table's columns list returned by the provided columns prop.
  // Each entry will be an object which looks something like: {field: "selectbox", type: "selectbox", html_text: "", ...optional args}
  // Each iteration of this loop will match a key of the columns to a key in the data prop, and use those to populate a single cell within the row
  let cells = props.columns.map((column) => {
    let cell_data = props.data[column.field];
    let cell;

    // Different column types require different patterns for rendering
    switch(column.type) {
      case 'selectbox':
        const selected = getSelectedStatus(column, props.data.name);
        cell = <TableCell key={column.field} padding="checkbox">
                <Checkbox
                   name={props.data.name+"-selectbox"}
                   checked={selected}
                   onChange={(event, key) => {props.selectableHandler(event, column, props.data)}}

                />
              </TableCell>;
        break;
      // Requires an overflow_items field in the value which matches the passed column key
      case 'overflow-menu':
        cell = <TableCell key={column.field} >
                  <OverflowMenu key={column.field} display="none"
                                items={cell_data.overflow_items} //requires that the props.data[column.field] returns an object with a defined overflow_items key
                  />
               </TableCell>;
        break;
      // Requires an options field for passing children
      case 'drop-down-parent':
        // Because drop-down-parent expects options (including what is contained by the drop down), it will store each column's options (where required) in the state hook object with key = column.field
        cell = <TableCell key={column.field}>
                  <IconButton aria-label="expand row" size="small" onClick={() => {dropDownParentSelector(column.field)}}>
                    {cellOptions[column.field].open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </IconButton>
                  {cell_data.html_text || ""}
               </TableCell>;
        if(cellOptions[column.field].open){
          let content;

          // Handler for whether raw components or objects representing components are passed to the drop-down
          switch(cellOptions[column.field].contentsType){
            case 'component':
              content = <ComponentTransporter registry={cellOptions[column.field].contents.registry}
                                              componentType={cellOptions[column.field].contents.componentType}
                                              componentProps={cellOptions[column.field].contents.componentProps}
                        />
              break;
            case 'raw':
            default:
              // Just relays the content
              content = cellOptions[column.field].contents;
          }

          expanded_rows.push(
            <TableRow key={column.field+"-content"}>
              <TableCell colSpan={props.columns.length}>
                <Collapse in={cellOptions[column.field].open}>
                  {content}
                </Collapse>
              </TableCell>
            </TableRow>
            );
        }
        break;
      case 'text':
      default:
        cell = <TableCell key={column.field}>{cell_data || ""}</TableCell>;
    }

    return cell;
  });

  return(
    <React.Fragment>
      <TableRow>
        {cells}
      </TableRow>
      {expanded_rows}
    </React.Fragment>
  );
}

export default ResourceIndexItem;

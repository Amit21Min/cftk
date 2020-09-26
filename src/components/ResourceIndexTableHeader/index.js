import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import Checkbox from '@material-ui/core/Checkbox';
import OverflowMenu from '../OverflowMenu';

// Populates and handles actions for the column headers of a ResourceIndexTable
const ResourceIndexTableHeader = (props) => {
  console.log(props);

  let column_headers = props.columns.map((column) => {
    let column_header;
    switch(column.type){
      case 'selectbox':
        column_header = <TableCell key={column.field} padding="checkbox">
                          <Checkbox type="checkbox" name="all-selectbox"
                            checked={props.allSelected}
                            onChange={(event, message) => props.selectColumnCallback(event, {type: "select-all", option: !props.allSelected})}/>
                        </TableCell>;
        break;
      case 'overflow-menu':
        column_header = <TableCell key={column.field}>
                          <OverflowMenu key={column.field}
                                        items={column.overflow_items} //requires that the props.data[column.field] returns an object with a defined overflow_items key
                          />
                       </TableCell>
        break;
      case 'drop-down-parent':
      case 'text':
      default:
        //on Click, a column header will send its self to perform an action, like sorting -->
        column_header = <TableCell key={column.field}
                            onClick={(event, message) => props.selectColumnCallback(event, {column_message: column.field})}>
                            {column.html_text}
                        </TableCell>;
    }
    return column_header;
  })

  return (
    <TableHead>
      <TableRow>
        {column_headers}
      </TableRow>
    </TableHead>
  );
};

export default ResourceIndexTableHeader;

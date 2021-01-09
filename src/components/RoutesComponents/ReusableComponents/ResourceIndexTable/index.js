import React, {useState, useEffect} from 'react';

import ResourceIndexItem from '../ResourceIndexItem';
import ResourceIndexTableHeader from '../ResourceIndexTableHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import ZeroResource from '../ZeroResource';

import "./index.css";


// Expects column objects to be passed as a list of dicts
// Then expects data to populate the rows of the table.

// PROPS:
// Column list ex:
  // [
  //   {field: "selectbox",             type: "selectbox",        html_text: "", selected_items: []}, //because this field has type 'selectbox' it also requires a selected_items list, which will be used to keep track of the items selected within the table
  //   {field: "drop_down",             type: "drop-down-parent", html_text: ""},
  //   {field: "name",                  type: "text",             html_text: "Name"},
  //   {field: "overflow",              type: "overflow-menu",    overflow_items: [
                                                                // {text: "Assign All", action: () => {overflow_actions.assignAllAction()}}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
  //                                                               {text: "Delete All", action: () => {overflow_actions.deleteAllAction()}}
  //                                                              ]
  //   }
  // ]
// SelectItemCallback, a function which will fire whenever one of the rows in the table is selected by the selectbox
// SelectColumnCallback, a function which will fire whenever a column header is clicked (for example, is a pathway to handle column-based sorting)

const ResourceIndexTable = ({columns, items, selectableItemHandler, selectableColumnHandler}) => {
  // Create a ResourceIndexItem for each item passed in as a prop. A ResourceIndexItem will generate 1 row of the table for its corresponding resource (in this case routes)
  let resource_items = items.map((item, i) => {
    let key = item.name ? item.name : i;
    return (<ResourceIndexItem
      key={key}
      data={item}
      columns={columns}
      selectableHandler={selectableItemHandler}
      options={item.options ? item.options : {}}
      />);

    }
  );
  return(
    <Table>
      <ResourceIndexTableHeader columns={columns} selectableHandler={selectableColumnHandler} />
      <TableBody>
        {resource_items}
      </TableBody>
    </Table>
  );
}
export default ResourceIndexTable;

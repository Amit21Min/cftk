import React, {useState, useEffect} from 'react';

import ResourceIndexItem from '../ResourceIndexItem';
import ResourceIndexTableHeader from '../ResourceIndexTableHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';


import ZeroResource from '../ZeroResource';

import "./index.css";


// Expects column names in a dict with keys in the order they are expected to appear
// Then expects data to populate the rows of the table.

// PROPS:
// Column dict ex:
  // {selectbox: "", name: "Name", soliciting_pct: "Allows Soliciting"} (special field 'selectbox' will create a select box in column header and for each row)
// SelectItemCallback, a function which will fire whenever one of the rows in the table is selected by the selectbox
// SelectColumnCallback, a function which will fire whenever a column header is clicked (for example, is a pathway to handle column-based sorting)
// allSelected: a prop which signals if the selectbox within the column header is 'on', in which case every ResourceIndexItem is considered selected

const ResourceIndexTable = (props) => {
  const selectItem = (event, item) => {
    props.selectItemCallback(event, item);
  }

  // A bubbled function cast from the prop 'selectColumnCallback'. Is bubbled to ResourceIndexTableHeader components, and is called whenever a column header is clicked.
  const selectColumn = (column) => {
    props.selectColumnCallback(column);
  }

  // A bubbled getter function from the prop 'columns'
  // This function is passed to ResourceIndexItems to allow them to match their data-fields for each row with the corresponding column.
  const getColumns = () => (
    props.columns
  );

  const getSelectedStatus = (route_key) => props.selectedItems[route_key] ? true : false;

  // Create a ResourceIndexItem for each item passed in as a prop. A ResourceIndexItem will generate 1 row of the table for its corresponding resource (in this case routes)
  let resource_items = props.items.map((item, i) => {
    let key = item.name ? item.name : i;
    let selected = getSelectedStatus(item.name);
    return (<ResourceIndexItem
      key={key} // this is subject to change once we have a reliable unique primary key
      data={item}
      getColumns={getColumns}
      selected={selected} // Uses the allSelected prop to override the selected status of individual items
      selectItemCallback={(event) => selectItem.bind(event, item.name)}/>);
  }

  );

  return(
    <Table>
      <ResourceIndexTableHeader columns={props.columns} selectColumnCallback={selectColumn} allSelected={props.allSelected}/>
      <TableBody>
        {resource_items}
      </TableBody>
    </Table>
  );
}

export default ResourceIndexTable;

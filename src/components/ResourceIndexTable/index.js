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

  // Create a ResourceIndexItem for each item passed in as a prop. A ResourceIndexItem will generate 1 row of the table for its corresponding resource (in this case routes)
  let resource_items = props.items.map((item, i) => {
    let key = item.name ? item.name : i;
    return (<ResourceIndexItem
      key={key}
      data={item}
      columns={props.columns}
      selectableHandler={props.selectableHandler}
      options={item.options ? item.options : {}}
      />);

    }
  );
  console.log(props);
  return(
    <Table>
      <ResourceIndexTableHeader columns={props.columns} />
      <TableBody>
        {resource_items}
      </TableBody>
    </Table>
  );
}

export default ResourceIndexTable;

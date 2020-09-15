import React from 'react';

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
          cell = <td key={column.field}>
                  <input type="checkbox"
                     name={props.data.name+"-selectbox"}
                     checked={props.selected}
                     onChange={props.selectItemCallback.bind(this, props.data.name)} // when checked, will trigger the function passed in props.selected, usually with the end result of adding this item's firebase primary key
                  />
                </td>;
          break;
        case 'overflow-menu':
          // Needs to be established
          break;
        case 'drop-down-parent':
        case 'text':
        default:
          cell = <td key={column.field}>{props.data[column.field] || ""}</td>;
      }
      return cell;
  });

  return(
    <tr>
      {cells}
    </tr>
  );
}

export default ResourceIndexItem;

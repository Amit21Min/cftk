import React from 'react';

import "./index.css";

// Represents a row within a ResourceIndexTable
const ResourceIndexItem = (props) => {
  let cells = [];
  // Loop through each of the entries (as a [key, value] pair) in the parent table's columns object returned by the provided getColumns prop.
  // This object will look something like: {selectbox: "", name: "Name", soliciting_pct: "Allows Soliciting"}
  // Each iteration of this loop will match a key of the columns to a key in the data prop, and use those to populate a single cell within the row
  for(const [key, value] of Object.entries(props.getColumns())){
    let cell;
    switch(key) {
      // If the key is selectbox, then generate a checkbox instead of a plain string for the content of the cell.
      case 'selectbox':
        cell = <td key={key}>
                <input type="checkbox"
                   name={props.data.name+"-selectbox"}
                   checked={props.selected}
                   onChange={props.selectItemCallback.bind(this, props.data.name)} // when checked, will trigger the function passed in props.selected, usually with the end result of adding this item's firebase primary key
                />
              </td>;
        break;
      // By default, populate a plain text cell
      default:
        cell = <td key={key}>{props.data[key] || ""}</td>;
    }
    cells.push(cell);
  }

  return(
    <tr>
      {cells}
    </tr>
  );
}

export default ResourceIndexItem;

import React from 'react';

import "./index.css";


const ResourceIndexItem = (props) => {
  let cells = [];
  for(const [key, value] of Object.entries(props.getColumns())){
    let cell;
    switch(key) {
      case 'selectbox':
        cell = <td key={key}><input type="checkbox" name={props.data.name+"-selectbox"} checked={props.selected} onChange={props.selectItemCallback.bind(this, props.data.name)}/></td>;
        break;
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

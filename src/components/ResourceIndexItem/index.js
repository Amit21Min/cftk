import React from 'react';

import "./index.css";


const ResourceIndexItem = (props) => {
  let cells = props.data.returned.map((cell) => (
    <td>{cell}</td>
  ));



  cells.unshift(
    <td>
      <input type="checkbox" checked={props.active} onClick={props.selectItemCallback.bind(this, props.data.id)}/>
    </td>
  );

  return(
    <tr>
      {cells}
    </tr>
  );
}

export default ResourceIndexItem;

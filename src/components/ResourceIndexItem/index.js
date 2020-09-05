import React from 'react';

import "./index.css";


const ResourceIndexItem = (props) => {
  let cells = props.data.map((cell) => (
    <td>{cell}</td>
  ));

  return(
    <tr>
      {cells}
    </tr>
  );
}

export default ResourceIndexItem;

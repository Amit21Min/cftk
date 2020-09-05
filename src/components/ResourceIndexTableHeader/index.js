import React from 'react';

const ResourceIndexTableHeader = (props) => {
  let column_headers = props.columns.map((column) =>
    <th>{column}</th>
  );

  return (
    <thead>
      <tr>
        {column_headers}
      </tr>
    </thead>
  );
};

export default ResourceIndexTableHeader;

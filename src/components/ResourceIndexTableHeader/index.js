import React from 'react';

// Populates and handles actions for the column headers of a ResourceIndexTable
const ResourceIndexTableHeader = (props) => {

  let column_headers = props.columns.map((column) => {
    let column_header;
    switch(column.type){
      case 'selectbox':
        column_header = <th key={column.field}>
                          <input type="checkbox" name="all-selectbox"
                            checked={props.allSelected}
                            onChange={props.selectColumnCallback.bind(this, {type: "select-all", option: !props.allSelected})}/>
                        </th>;
        break;
      case 'overflow-item':
        break;
      case 'drop-down-parent':
      case 'text':
      default:
        //on Click, a column header will send its self to perform an action, like sorting -->
        column_header = <th key={column.field}
                            onClick={props.selectColumnCallback.bind(this, {column_message: column.field})}>
                            {column.html_text}
                        </th>;
    }
    return column_header;
  })

  return (
    <thead>
      <tr>
        {column_headers}
      </tr>
    </thead>
  );
};

export default ResourceIndexTableHeader;

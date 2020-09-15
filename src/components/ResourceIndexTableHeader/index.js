import React from 'react';

// Populates and handles actions for the column headers of a ResourceIndexTable
const ResourceIndexTableHeader = (props) => {

  let column_headers = [];
  for(const [key, value] of Object.entries(props.columns)){
    let column_header;
    switch(key){
      case 'selectbox':
        column_header = <th key={key}>
                          <input type="checkbox" name="all-selectbox"
                            checked={props.allSelected}
                            onChange={props.selectColumnCallback.bind(this, {type: "select-all",
                            option: !props.allSelected})}/>
                        </th>;
        break;
      default:
        //on Click, a column header will send its self to perform an action, like sorting --> 
        column_header = <th key={key}
                          onClick={props.selectColumnCallback.bind(this, {column_message: key})}>
                          {value}
                        </th>;
    }
    column_headers.push(column_header);
  }

  return (
    <thead>
      <tr>
        {column_headers}
      </tr>
    </thead>
  );
};

export default ResourceIndexTableHeader;

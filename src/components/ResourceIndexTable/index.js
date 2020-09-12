import React, {useState, useEffect} from 'react';

import ResourceIndexItem from '../ResourceIndexItem';
import ResourceIndexTableHeader from '../ResourceIndexTableHeader';

import ZeroResource from '../ZeroResource';

import "./index.css";


// Expects column names in a list in the order they are expected to appear, for Routes
// ex: props.columns = ["Street", "Months Since Last Assigned", "Assignment Status", "Donations From Last Canning", "Average Donation Per House", "Percentage Wants to Learn More", "Percentage Allows Soliciting"]
// Then expects data to populate the columns as an object with keys equal to the previously described list,

// ex: props.items = [{settings: [], data: ["Wohler Court", "6", "Not Assigned", "$300", "$100", "31%", "25%"]}]
const ResourceIndexTable = (props) => {
  const selectItem = (item) => {
    props.selectItemCallback(item);
  }

  const selectColumn = (column) => {
    props.selectColumnCallback(column);
  }

  const getColumns = () => (
    props.columns
  );

  let all_selected = true;
  let resource_items = [];

  for(let i = 0; i < props.items.length; i++){
    let item = props.items[i];
    resource_items.push(<ResourceIndexItem
                            key={item.name ? item.name : i}
                            data={item}
                            getColumns={getColumns}
                            selected={item.name ? props.selectedItems[item.name] : false}
                            selectItemCallback={selectItem}/>);

    if(!props.selectedItems[item.name] || props.selectedItems[item.name] == false){
      all_selected = false;
    }
  }




  return(
    <table className="table">
      <ResourceIndexTableHeader columns={props.columns} selectColumnCallback={selectColumn} allSelected={all_selected}/>
      <tbody>
        {resource_items}
      </tbody>
    </table>
  );
}

export default ResourceIndexTable;

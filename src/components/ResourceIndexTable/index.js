import React, {useState, useEffect} from 'react';

import ResourceIndexItem from '../ResourceIndexItem';
import ResourceIndexTableHeader from '../ResourceIndexTableHeader';

import "./index.css";


// Expects column names in a list in the order they are expected to appear, for Routes
// ex: props.columns = ["Street", "Months Since Last Assigned", "Assignment Status", "Donations From Last Canning", "Average Donation Per House", "Percentage Wants to Learn More", "Percentage Allows Soliciting"]
// Then expects data to populate the columns as an object with keys equal to the previously described list,

// ex: props.items = [{settings: [], data: ["Wohler Court", "6", "Not Assigned", "$300", "$100", "31%", "25%"]}]
const ResourceIndexTable = (props) => {
  const [selectedResources, setSelectedResources] = useState({});

  let resource_items = props.items.map((item,i) => (
      <ResourceIndexItem data={item.data} settings={item.settings} selected={selectedResources[i] == true ? true : false} />
  ));

  const selectResource = (resource_key) => {
    let r = {};
    r[resource_key] = true;
    setSelectedResources(Object.assign({}, selectedResources, r));
  }

  return(
    <table class="table">
      <ResourceIndexTableHeader columns={props.columns} />
      <tbody>
        {resource_items}
      </tbody>
    </table>
  );
}

export default ResourceIndexTable;

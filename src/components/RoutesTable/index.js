import React, {useState} from 'react';

import SearchBar from '../SearchBar';
import AddButton from '../AddButton';

import ResourceIndexTable from '../ResourceIndexTable';

import * as ROUTES from '../../constants/routes';


const RoutesTable = (props) => {
  const [queryState, setQueryState] = useState(null);

  const searchCallback = (query) => {
    console.log("Searching for: " + query);
    setQueryState(query);
  }

  const newRoute = () => {
    console.log("Creating a new route!");
  }


  return(
    <div>
      <div style={{width: "100%", display: "flex", 'flex-direction': "row", 'justify-content': "space-between"}}>
        <SearchBar queryCallback={searchCallback}/>
        <AddButton clickCallback={newRoute} route={ROUTES.ADMIN_ROUTES_NEW}/>
      </div>
      <ResourceIndexTable items={props.data} columns={props.fields}/>
    </div>
  );
};

export default RoutesTable;

import React, {useState} from 'react';

import SearchBar from '../SearchBar';
import AddButton from '../AddButton';
import * as ROUTES from '../../constants/routes';

const RoutesTable = (props) => {
  const [queryState, setQueryState] = useState(null);

  const searchCallback = (query) => {
    console.log("Searching for: " + query);
    setQueryState(query);
  }

  const newRoute = () => {
    alert("Creating a new route!");
  }

  return(
    <div>
      <div style={{width: "100%", display: "flex", 'flexDirection': "row", 'justifyContent': "space-between"}}>
        <SearchBar queryCallback={searchCallback}/>
        <AddButton clickCallback={newRoute} route={ROUTES.ADMIN_ROUTES_NEW}/>
      </div>
      <p>Table!</p>
    </div>
  );
};

export default RoutesTable;

import React, {useState} from 'react';

import SearchBar from '../SearchBar';
import AddButton from '../AddButton';

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
      <div style={{width: "100%", display: "flex", 'flex-direction': "row", 'justify-content': "space-between"}}>
        <SearchBar queryCallback={searchCallback}/>
        <AddButton clickCallback={newRoute}/>
      </div>
      <p>Table!</p>
    </div>
  );
};

export default RoutesTable;

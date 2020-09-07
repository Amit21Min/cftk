import React, { useState } from 'react';

import './index.css'
import SearchBar from '../SearchBar';
import AddButton from '../AddButton';

const RoutesTable = (props) => {
  const [queryState, setQueryState] = useState(null);
  const routes = props.routes;

  const searchCallback = (query) => {
    console.log("Searching for: " + query);
    setQueryState(query);
  }

  const newRoute = () => {
    alert("Creating a new route!");
  }

  return (
    <div>
      <div className="toolbar">
        <SearchBar queryCallback={searchCallback} />
        <AddButton clickCallback={newRoute} />
      </div>
      <p>Table!</p>
      <div className="route-table">
        {routes.map((route) =>
        <>
          <p key="name">{route.name}</p>
          <p key="donation"> ${route.canningData.totalDonations}</p>
        </>
      )}</div>
    </div>
  );
};

export default RoutesTable;

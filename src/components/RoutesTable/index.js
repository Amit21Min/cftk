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
      <div className="route-table">
        <table class="table" key="table">
          <thead>
            <tr>
              <th><abbr title="name">Name</abbr></th>
              <th><abbr title="amount-collected">Previous Canning Donations</abbr></th>
              <th><abbr title="last-canned">Last Canning Date</abbr></th>
              <th><abbr title="assignment-status">Assignment Status</abbr></th>
            </tr>
          </thead>
          <tbody>
          {routes.map((route) =>
            <tr key={route.name}>
              <th>{route.name}</th>
              <th>${route.canningData.totalDonations}</th>
              <th>{route.canningData.lastCanned.toDate().toString()}</th>
              <th>{route.assignmentStatus.toString()}</th>
            </tr>
          )}
          </tbody>
          {/* <p key="name">{route.name}</p>
          <p key="donation"> ${route.canningData.totalDonations}</p> */}
        </table>
      </div>
    </div>
  );
};

export default RoutesTable;

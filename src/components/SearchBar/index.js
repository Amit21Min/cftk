import React from 'react';

import "./index.css";

const SearchBar = (props) => {

  const updateQuery = (event) => {
    props.queryCallback(event.target.value);
  };

  return(
    <div className="search-bar">
      <input type="text" class="search-bar-input" placeholder="Search..." onChange={updateQuery}/>
      <div className="icon-container"/>
    </div>
  );
};

export default SearchBar;

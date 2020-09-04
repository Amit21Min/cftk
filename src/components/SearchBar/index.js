import React from 'react';

import "./index.css";

const SearchBar = (props) => {

  const updateQuery = (event) => {
    props.queryCallback(event.target.value);
  };

  return(
    <div class="search-bar">
      <input type="text" class="search-bar-input" placeholder="Search..." onChange={updateQuery}/>
      <div class="icon-container"/>
    </div>
  );
};

export default SearchBar;

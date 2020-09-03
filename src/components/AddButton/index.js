import React from 'react';

import "./index.css";

const AddButton = (props) => (
  <a class="button-circle blue" onClick={props.clickCallback}>
    +
  </a>
);

export default AddButton;

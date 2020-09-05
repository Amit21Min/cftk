import React from 'react';
import {
  Link
} from "react-router-dom";

import "./index.css";

const AddButton = (props) => (
  <Link class="button-circle blue" onClick={props.clickCallback} to={props.route}>
    +
  </Link>
);

export default AddButton;

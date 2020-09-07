import React from 'react';
import {
  Link
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';
import "./index.css";

const AddButton = (props) => (
  <Link className="button-circle blue" onClick={props.clickCallback} to={ROUTES.ADMIN_ROUTES_NEW}>
    +
  </Link>
);

export default AddButton;

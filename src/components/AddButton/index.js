import React from 'react';
import {
  Link
} from "react-router-dom";
import "./index.css";

const AddButton = (props) => {
  // This supports 2 button types - A link button or a non-link button. If props.route is defined, then a ROUTE has been passed and a link button needs
  // to be returned. If props.route is undefined, then just return a normal button.
  if (props.route) {
    return(
      <Link className="button-circle blue" onClick={props.clickCallback} to={props.route}>
        +
      </Link>
    )
  } else {
    return(
      <button className="button-circle blue" onClick={props.clickCallback} to={props.route}>
        +
      </button>
    )
  }

};

export default AddButton;

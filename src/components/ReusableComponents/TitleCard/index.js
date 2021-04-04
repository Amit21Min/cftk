import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import db from "../../FirebaseComponents/Firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  toolBar: {
    color: "black",
    backgroundColor: "white",
    height: "88px",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "29px",
    lineHeight: "32px",
  },
  appBar: {
    boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.08)",
  },
  tabs: {
    marginLeft: "61px",
  },
  customHeight: {
    height: "88px"
  }
}));

const TitleCard = (props) => {
  const classes = useStyles();

  const [cities, setCities] = useState(new Set().add("All"));
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    db.collection("Routes")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCities((prev) => new Set(prev.add(doc.data().city)));
        });
      });
  }, []);

  return (
    <div className={classes.root}>
      {props.title === "Routes" && (
        <>
          <AppBar position="static" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
              {props.title}
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
                className={classes.tabs}
                classes={{flexContainer: classes.customHeight}}
              >
                {Array.from(cities).map((city) => {
                  return (
                    <Tab key={city} label={city}/>
                  );
                })}
              </Tabs>
            </Toolbar>
          </AppBar>
        </>
      )}
      {props.title != "Routes" && (
        <AppBar position="static" elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolBar}> {props.title}</Toolbar>
        </AppBar>
      )}
    </div>
  );
};

export default TitleCard;

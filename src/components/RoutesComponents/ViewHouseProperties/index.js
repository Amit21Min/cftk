import React, { useEffect, useState } from "react";
import "./style.css";
import { db } from "../../FirebaseComponents/Firebase/firebase";
import PanelBanner from "../ReusableComponents/PanelBanner";

import {withStyles} from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  houseList: {
    maxWidth: 300,
  },
  vhpCard: {
    backgroundColor: "#F1F3F5",
    borderRadius: "24px",
    width: "248px",
    height: '320px'
  },
  vhpCardTitle: {
    fontWeight: 600,
    fontSize: "20px",
    font: "Raleway",
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  }
}));

const SaveButton = withStyles({
  root: {
    background: '#0075A3',
    color: 'white',
    borderRadius: '19px',
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: '300',
    width: '88px',
    height: '36px',
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
    '&:hover': {
      background: '#0075A3',
      color: 'white',
    }
  }
})(Button);

const ViewHouseProperties = (props) => {
  const route = props.location.state;
  //function to get route - not yet implemented
  /*
    function getRoute(streetArray) {
        var maps_API = process.env.REACT_APP_MAPS_API_KEY
       var routeString = "&origin=" + streetArray[0]
       routeString += "&destination=" + streetArray[streetArray.length - 1]
       routeString += "&waypoints="
       for (var i = 1; i < streetArray.length - 1; i++) {
         routeString += streetArray[i];
          if (i < streetArray.length - 2) {
             routeString += "|"
         }
     }
     return `https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_MAPS_API_KEY}${routeString}&mode=walking`;
 }
*/
  //returns source to display house on google map
  function getHouse(street, houseNumber, city) {
    var address = `${houseNumber}+${street}+${city}`;
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
  }

  const [streets, setStreets] = useState();
  const [numbers, setNumbers] = useState();

  const [street, setStreet] = useState();
  const [number, setNumber] = useState();
  const [city, setCity] = useState();

  const [street_selected, setStreetSelected] = useState(false);
  const [house_selected, setHouseSelected] = useState(false);

  const [source, setSource] = useState();

  const classes = useStyles();

  const [data, setData] = useState({
    donations: [
      {
        amount: null,
        date: null,
      },
    ],
    solicitation: [
      {
        allowed: null,
        date: null,
      },
    ],
    learnMore: [
      {
        learn: null,
        date: null,
      },
    ],
    comments: [
      {
        comment: null,
        date: null,
      },
    ],
  });

  //runs only once - sets streets based on route
  useEffect(() => {
    db.collection("Routes")
      .doc(route)
      .get()
      .then((doc) => {
        const data = doc.data();
        setStreets(data.streets);
      });
  }, []);

  //runs every time street or house number is changed
  useEffect(() => {
    if (street_selected) {
      db.collection("Streets")
        .doc(street)
        .get()
        .then((doc) => {
          const data = doc.data();
          let _numbers = [];
          for (let address in data) {
            if (!isNaN(address)) {
              _numbers.push(address);
            }
            //established house number options and data for google map
            setNumbers(_numbers);
            setCity(data.city);
          }
          if (house_selected) {
            //set data according to street and house number
            let address = data[number];
            let _comments = [];
            let _solicitation = [];
            let _learnMore = [];
            let _donations = [];
            for (let i = 0; i < address.visitDates.length; i++) {
              for (let _date in address.visitDates[i]) {
                let _address = address.visitDates[i][_date];
                _comments.push({
                  comment: _address.volunteerComments,
                  date: _date,
                });
                _solicitation.push({
                  allowed: _address.solicitationAllowed,
                  date: _date,
                });
                _learnMore.push({
                  learn: _address.learnMore,
                  date: _date,
                });
                _donations.push({
                  amount: _address.donationAmt,
                  date: _date,
                });
              }
            }
            setData({
              donations: _donations,
              solicitation: _solicitation,
              learnMore: _learnMore,
              comments: _comments,
            });
          }
        });
    }
  }, [street, number]);

  const getDonation = (visit_i) => {
    if (visit_i >= data.donations.length) {
      return null;
    }
    return data.donations[visit_i].amount;
  };

  const solicitationAllowedText = (visit_i) => {
    if (visit_i >= data.solicitation.length) {
      return null;
    }
    return data.solicitation[visit_i].allowed ? "Allowed" : "Not Allowed";
  };

  const learnMoreText = (visit_i) => {
    if (visit_i >= data.learnMore.length) {
      return null;
    }
    return data.learnMore[visit_i].learn ? "Yes" : "No";
  };

  const getComment = (visit_i) => {
    if (visit_i >= data.comments.length) {
      return null;
    }
    return data.comments[visit_i].comment;
  };

  const getGroup = (index) => {
    return null;
  };

  const getDate = (index) => {
    return data.comments[0].date;
  };

  const handleStreetChange = (event, value, reason) => {
    if (reason === "select-option") {
      setHouseSelected(false);
      setStreetSelected(true);
    }
    if (reason === "clear") {
      setHouseSelected(false);
      setStreetSelected(false);
    }
    setStreet(value);
  };

  const handleNumberChange = (event, value, reason) => {
    if (reason === "select-option") {
      setHouseSelected(true);
      setSource(getHouse(street, value, city));
    }
    if (reason === "clear") {
      setHouseSelected(false);
    }
    setNumber(value);
  };

  function HouseProperties(props) {
    if (!props.house) {
      return <b id="selectHouse">Select a house to view its properties</b>;
    }

    return (
      <div className="house-props-cards">
          <Card className={classes.vhpCard}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.vhpCardTitle}
              >
                Solicitations
              </Typography>
              <div>
                <h6>{solicitationAllowedText(0)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{solicitationAllowedText(1)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{solicitationAllowedText(2)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="primary" style={{fontWeight:600, fontSize:'16px'}}>View All</Button>
            </CardActions>
          </Card>

          <Card className={classes.vhpCard}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.vhpCardTitle}
              >
                Donations
              </Typography>
              <div>
                <h6>${getDonation(0)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>${getDonation(1)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>${getDonation(2)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="primary" style={{fontWeight:600, fontSize:'16px'}}>View All</Button>
            </CardActions>
          </Card>

          <Card className={classes.vhpCard}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.vhpCardTitle}
              >
                Volunteer Comments
              </Typography>
              <div>
                <h6>{getComment(0)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{getComment(1)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{getComment(2)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="primary" style={{fontWeight:600, fontSize:'16px'}}>View All</Button>
            </CardActions>
          </Card>

          <Card className={classes.vhpCard}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.vhpCardTitle}
              >
                Interested in Learning More
              </Typography>
              <div>
                <h6>{learnMoreText(0)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{learnMoreText(1)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
              <Divider />
              <div>
                <h6>{learnMoreText(2)}</h6>
                <small>
                  Group {getGroup(0)} | {getDate(0)}
                </small>
              </div>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="primary" style={{fontWeight:600, fontSize:'16px'}}>View All</Button>
            </CardActions>
          </Card>
        </div>
    );
  }

  return (
    <div>
      <h2 className="title">{route} House Properties</h2>
      <div className="vhp-container">
        <div classsName="left-container">
          <div className="selection-items">
            <div className="street-select">
              <Autocomplete
                id="street-select"
                options={streets}
                getOptionLabel={(option) => option.toString()}
                style={{ width: 275 }}
                onChange={handleStreetChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Street name"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="house-select">
              <Autocomplete
                id="numbers-select"
                options={numbers}
                getOptionLabel={(option) => option.toString()}
                style={{ width: 275 }}
                value={!house_selected ? null : number}
                disabled={!street_selected}
                onChange={handleNumberChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="House number"
                    variant="filled"
                    disabled={!street_selected}
                  />
                )}
              />
            </div>
          </div>
          <div className="google_map">
            <iframe
              title="viewHouse"
              width="570"
              height="460"
              frameBorder="0"
              styles="border:0"
              src={source}
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="right-container">
          <div className="house-properties">
            <HouseProperties house={house_selected} />
          </div>
        </div>
      </div>
      <div className="vhp-buttons">
        <Button size="small" color="primary" style={{fontWeight:600, fontSize:'16px'}}>Cancel</Button>
        <SaveButton>Save</SaveButton>
      </div>
    </div>
  );
};

export default ViewHouseProperties;

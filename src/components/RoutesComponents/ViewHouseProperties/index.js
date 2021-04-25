import React, { useEffect, useState } from "react";
import "./style.css";
import { db } from "../../FirebaseComponents/Firebase/firebase";

import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";


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
    height: "320px",
    color: "#051820",
  },
  vhpCardTitle: {
    fontWeight: 600,
    fontSize: "20px",
    font: "Raleway",
    marginBottom: "32px",
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  cardSmallText: {
    fontSize: "11px",
  },
  dialogPaper: {
    maxHeight: "721px",
    width: "436px",
    textAlign: "center",
  },
  dialogListContainer: {
    textAlign: "left",
    margin: "20px",
  },
  dialogSmallText: {
    fontSize: "11px",
    color: "#6D6E71",
  },
  dialogSelect: {
    margin: "0px 32px",
    textAlign: "left",
  },
  customDateFilter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  }
}));

const SaveButton = withStyles({
  root: {
    background: "#0075A3",
    color: "white",
    borderRadius: "19px",
    fontSize: "14px",
    lineHeight: "19px",
    fontWeight: "300",
    width: "88px",
    height: "36px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
    "&:hover": {
      background: "#0075A3",
      color: "white",
    },
  },
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const [filter, setFilter] = useState(60);

  const [customDates, setCustomDates] = useState({from: '2017-05-24', to: '2019-05-24'});

  const handleDialogOpen = (_title) => {
    setDialogTitle(_title);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const filterChange = (event) => {
    setFilter(event.target.value);
  };

  const customDateChange = (key) => (event) => {
    setCustomDates({...customDates, [key]: event.target.value})
  }

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
    })
    }, [])
   
    //runs every time street or house number is changed
    useEffect(() => {
        if (street_selected) {
            db.collection("Streets").doc(street).get().then(doc => {
                const data = doc.data();
                let _numbers = []
               for (let address in data) {
                   if (!isNaN(address)) {  
                    _numbers.push(address)
                   }
               //established house number options and data for google map
                setNumbers(_numbers);
               setCity(data.city);
                }
               if (house_selected) {
                //set data according to street and house number
                let address = data[number]
                let _comments = []
                let _solicitation = []
                let _learnMore = []
                let _donations = []
                for(let i = 0; i < address.visitDates.length; i++){
                    for (let _date in address.visitDates[i]) {
                        let _address = address.visitDates[i][_date]
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
                        })
                        _donations.push({
                            amount: _address.donationAmt,
                            date: _date,
                        }) 
                    }
                }
                setData({
                    donations: _donations,
                    solicitation: _solicitation,
                    learnMore: _learnMore,
                    comments: _comments,
                }) 
            }

            // Sorting all of the data by date
            _comments = _comments.sort((a, b) => new Date(b.date) - new Date(a.date));
            _donations = _donations.sort((a, b) => new Date(b.date) - new Date(a.date));
            _learnMore = _learnMore.sort((a, b) => new Date(b.date) - new Date(a.date))
            _solicitation = _solicitation.sort((a, b) => new Date(b.date) - new Date(a.date))


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

  const getGroup = (index) => {
    return null;
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

  function sixMonthsPrior(date) {
    // Copy date so don't affect original
    var d = new Date(date);
    // Get the current month number
    var m = d.getMonth();
    // Subtract 6 months
    d.setMonth(d.getMonth() - 6);
    // If the new month number isn't m - 6, set to last day of previous month
    // Allow for cases where m < 6
    var diff = (m + 12 - d.getMonth()) % 12;
    if (diff < 6) d.setDate(0);

    return d;
  }

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
            {data.solicitation.slice(0, 3).map((item, index) => {
              return (
                <div key={index}>
                  <h6>{item.allowed ? "Allowed" : "Not Allowed"}</h6>
                  <small className={classes.cardSmallText}>
                    Group {getGroup(0)} | {item.date}
                  </small>
                  <Divider style={{ marginTop: "10px" }} />
                </div>
              );
            })}
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              size="small"
              color="primary"
              style={{ fontWeight: 600, fontSize: "16px" }}
              onClick={() => handleDialogOpen("Solicitations")}
            >
              View All
            </Button>
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
            {data.donations.slice(0, 3).map((item, index) => {
              return (
                <div key={index}>
                  <h6>${item.amount}</h6>
                  <small className={classes.cardSmallText}>
                    Group {getGroup(0)} | {item.date}
                  </small>
                  <Divider style={{ marginTop: "10px" }} />
                </div>
              );
            })}
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              size="small"
              color="primary"
              style={{ fontWeight: 600, fontSize: "16px" }}
              onClick={() => handleDialogOpen("Donations")}
            >
              View All
            </Button>
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
            {data.comments.slice(0, 3).map((item, index) => {
              return (
                <div key={index}>
                  <h6>{item.comment}</h6>
                  <small className={classes.cardSmallText}>
                    Group {getGroup(0)} | {item.date}
                  </small>
                  <Divider style={{ marginTop: "10px" }} />
                </div>
              );
            })}
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              size="small"
              color="primary"
              style={{ fontWeight: 600, fontSize: "16px" }}
              onClick={() => handleDialogOpen("Volunteer Comments")}
            >
              View All
            </Button>
          </CardActions>
        </Card>

        <Card className={classes.vhpCard}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className={classes.vhpCardTitle}
              style={{ marginBottom: "8px" }}
            >
              Interested in Learning More
            </Typography>
            {data.learnMore.slice(0, 3).map((item, index) => {
              return (
                <div key={index}>
                  <h6>{item.learn ? "Yes" : "No"}</h6>
                  <small className={classes.cardSmallText}>
                    Group {getGroup(0)} | {item.date}
                  </small>
                  <Divider style={{ marginTop: "10px" }} />
                </div>
              );
            })}
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              size="small"
              color="primary"
              style={{ fontWeight: 600, fontSize: "16px" }}
              onClick={() => handleDialogOpen("Learn More")}
            >
              View All
            </Button>
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
        <Button
          size="small"
          color="primary"
          style={{ fontWeight: 600, fontSize: "16px" }}
        >
          Cancel
        </Button>
        <SaveButton>Save</SaveButton>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        classes={{ paper: classes.dialogPaper }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.vhpCardTitle}>
          {dialogTitle}
        </DialogTitle>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          onChange={filterChange}
          className={classes.dialogSelect}
        >
          <MenuItem value={10}>Custom</MenuItem>
          <MenuItem value={20}>Last 30 days</MenuItem>
          <MenuItem value={30}>Last 6 months</MenuItem>
          <MenuItem value={40}>Last year</MenuItem>
          <MenuItem value={50}>Last 5 years</MenuItem>
          <MenuItem value={60}>All time</MenuItem>
        </Select>
        <DialogContent>
          {dialogTitle === "Volunteer Comments" && (
            <div className={classes.dialogListContainer}>
              {filter === 60 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        <h6>{value.comment}</h6>
                        <small className={classes.dialogSmallText}>
                          Group | {value.date}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 50 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <= 5 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 40 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <= 1 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 30 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= sixMonthsPrior(new Date()) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 20 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >=
                          new Date().setDate(new Date().getDate() - 30) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 10 && (
                <div>
                  <form className={classes.customDateFilter} noValidate>
                      <TextField
                        label="From"
                        type="date"
                        value={customDates.from}
                        onChange={customDateChange('from')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="To"
                        type="date"
                        value={customDates.to}
                        onChange={customDateChange('to')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br></br><br></br>
                    </form>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= new Date(customDates.from) && new Date(value.date) <= new Date(customDates.to) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {dialogTitle === "Solicitations" && (
            <div className={classes.dialogListContainer}>
              {filter === 60 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        <h6>{value.comment}</h6>
                        <small className={classes.dialogSmallText}>
                          Group | {value.date}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 50 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <=
                          5 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 40 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <=
                          1 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 30 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= sixMonthsPrior(new Date()) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 20 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >=
                          new Date().setDate(new Date().getDate() - 30) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 10 && (
                <div>
                  <form className={classes.customDateFilter} noValidate>
                      <TextField
                        label="From"
                        type="date"
                        value={customDates.from}
                        onChange={customDateChange('from')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="To"
                        type="date"
                        value={customDates.to}
                        onChange={customDateChange('to')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br></br><br></br>
                    </form>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= new Date(customDates.from) && new Date(value.date) <= new Date(customDates.to) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {dialogTitle === "Donations" && (
            <div className={classes.dialogListContainer}>
              {filter === 60 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        <h6>{value.comment}</h6>
                        <small className={classes.dialogSmallText}>
                          Group | {value.date}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 50 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <=
                          5 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 40 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <=
                          1 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 30 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= sixMonthsPrior(new Date()) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 20 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >=
                          new Date().setDate(new Date().getDate() - 30) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 10 && (
                <div>
                  <form className={classes.customDateFilter} noValidate>
                      <TextField
                        label="From"
                        type="date"
                        value={customDates.from}
                        onChange={customDateChange('from')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="To"
                        type="date"
                        value={customDates.to}
                        onChange={customDateChange('to')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br></br><br></br>
                    </form>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= new Date(customDates.from) && new Date(value.date) <= new Date(customDates.to) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {dialogTitle === "Learn More" && (
            <div className={classes.dialogListContainer}>
              {filter === 60 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        <h6>{value.comment}</h6>
                        <small className={classes.dialogSmallText}>
                          Group | {value.date}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 50 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <= 5 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 40 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {Number(value.date.substring(6, value.date.length)) -
                          new Date().getFullYear() <= 1 && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 30 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= sixMonthsPrior(new Date()) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 20 && (
                <div>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >=
                          new Date().setDate(new Date().getDate() - 30) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {filter === 10 && (
                <div>
                  <form className={classes.customDateFilter} noValidate>
                      <TextField
                        label="From"
                        type="date"
                        value={customDates.from}
                        onChange={customDateChange('from')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="To"
                        type="date"
                        value={customDates.to}
                        onChange={customDateChange('to')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br></br><br></br>
                    </form>
                  {data.comments.map((value, index) => {
                    return (
                      <div key={index}>
                        {new Date(value.date) >= new Date(customDates.from) && new Date(value.date) <= new Date(customDates.to) && (
                          <div>
                            <h6>{value.comment}</h6>
                            <small className={classes.dialogSmallText}>
                              Group | {value.date}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewHouseProperties;

import React, { useEffect, useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../ReusableComponents/RouteModels/routes';
import { Link } from 'react-router-dom'
import { Typography, Grid, TextField } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import GroupedTextField from '../../ReusableComponents/GroupedTextField';
import DualGroupedTextField from '../../ReusableComponents/GroupedTextField/DualGroupedTextField';
import ChipList from '../../ReusableComponents/ChipList';
import PillButton from '../../ReusableComponents/PillButton';

import * as ROUTES from '../../../constants/routes';

import { Map } from '../Map';

// TODO: Implement revision history and modified by (Feature from figma, but rather weird for creating a route)
// TODO: Deal with google map implementation (the map doesn't update properly after the inital adding of addresses)
// TODO: Figure out chiplist input (currently just using a chiplist underneath the input)
// TODO: Validate Route Name, their shouldn'st be a repeated name in Firebase. Needs more Firebase integration
// TODO: Fix vertical overflow with smaller screens. There seems to be extra whitespace somewhere

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0075A3',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  },
});

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: '4rem',
    height: 'calc(100% - 8rem)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      margin: '0px',
      marginLeft: '160px'
    },
  },
  formButton: {
    width: '160px',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },
  buttonContainer: {
    // width: '100%',
    marginTop: '3rem',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      marginLeft: 'auto',
    },
  },
  gridContainer: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    }
  },
  gridRequired: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '1',
      gridRow: '1',
      margin: '1rem',
      marginLeft: '0px',
    }
  },
  gridOld: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '1',
      gridRow: '2',
      margin: '1rem',
      marginLeft: '0px',
    }
  },
  gridMap: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '2',
      gridRow: '1/3',
      margin: '1rem',
      marginLeft: '0px',
    }
  }
}));

const NewRoutePanel = () => {

  // variables used in the state
  const [routeName, setRouteName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [cityName, setCityName] = useState('');
  const [isValidCity, setIsValidCity] = useState(true);
  const [currStreet, setCurrStreet] = useState('');
  const [currHouses, setCurrHouses] = useState('');
  const [isValidStreet, setIsValidStreet] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [houseNumbers, setHouseNumbers] = useState({});
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const [validForm, setValidForm] = useState(false);

  const validateForm = () => {
    setValidForm(addressList.length > 0 && routeName.length > 0 && cityName.length > 0)
  }

  useEffect(validateForm, [routeName, cityName, addressList])

  const getNewHouseNums = (parsedStreet, numbers) => {
    if (houseNumbers[parsedStreet] != null) {
      let totalNumbers = [...houseNumbers[parsedStreet], ...numbers].filter((c, index) => {
        return [...houseNumbers[parsedStreet], ...numbers].indexOf(c) === index;
      });
      return { ...houseNumbers, [parsedStreet]: totalNumbers.sort((a, b) => a - b) }
    }
    else return { ...houseNumbers, [parsedStreet]: numbers.sort((a, b) => a - b) }
  }

  const updateStreetList = e => {
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault();

    // STILL NEED TO IMPLEMENT - SHOWING THE HOUSE NUMBERS + STREET (CURRENTLY ONLY SHOWS STREET WHEN ADDED)
    // BARE FUNCTIONALITY, PROBABLY MANY BUGS

    // Turns comma seperated list into array
    let numbers = currHouses.trim().split(",");
    // Removes duplicates
    numbers = numbers.filter((num, index) => numbers.indexOf(num) === index);
    // Changes current street into a non basic lowercase characters
    let parsedStreet = currStreet.replace(/\W/g, '').toLowerCase();

    let newHouseNums = getNewHouseNums(parsedStreet, numbers);
    let totalAddresses = [];

    for (let street in newHouseNums) {
      let streetAddresses = newHouseNums[street].map(num => `${num} ${street}`);
      totalAddresses = [...totalAddresses, ...streetAddresses];
    }

    setAddressList(totalAddresses);
    // stores houseNumbers as {street1: [122,123,145], street2: [122,123,124]}
    setHouseNumbers(newHouseNums);

    setCurrStreet('');
    setCurrHouses('');
  }


  const removeStreet = street => {
    // Removes specified street

    // Simplifies Street
    let streetName = street.replace(/\W/g, '').replace(/[0-9]/g, '').toLowerCase();
    let streetNum = parseInt(street).toString();

    setAddressList(prevState => prevState.filter(name => name !== street));
    setHouseNumbers(prevState => {
      prevState[streetName] = prevState[streetName].filter(number => number !== streetNum)
      // If the street no longer has any addresses in it, delete it
      if (prevState[streetName].length === 0) delete prevState[streetName];
      return prevState;
    });

    setIsValidStreet(true);
  }

  const updateNoteList = e => {
    // Adds note to list as long as the note is not already included or the input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (volNotes.includes(currNote)) {
      alert("Please don't repeat a existing note");
      return;
    } else if (currNote === '') {
      alert("Please enter some text");
      return;
    }

    setVolNotes(prevState => [...prevState, currNote]);
    setCurrNote('');
  }

  const removeNote = note => {
    // Removes the specified volunteer note
    setVolNotes(prevState => prevState.filter(text => text !== note))
  }

  const handleDateFocus = e => {
    // When clicking on input, switches input type to date. Allows for placeholder text
    e.currentTarget.type = 'date';
  }

  const handleDateBlur = e => {
    // Changes input back to text if it is empty so placeholder text can still be shown
    if (canningDate === '' || canningDate === 'mm/dd/yy') e.currentTarget.type = 'text';
  }

  const handleRoute = (e) => {
    setIsValidName(e.target.value.length > 0);
    setRouteName(e.target.value);
  }

  const handleCity = (e) => {
    setIsValidCity(e.target.value.length > 0);
    setCityName(e.target.value);
  }

  const handleStreet = (e) => {
    setCurrStreet(e.target.value.replace(/[^A-Za-z]/g, ''))
  }

  const handleAddress = (e) => {
    setCurrHouses(e.target.value.replace(/[^0-9,]/g, ''))
  }

  const handleDonated = (e) => {
    setNumDonated(e.target.value.replace(/[^0-9]/g, ''))
  }

  const handleDates = (e) => {
    setCanningDate(e.target.value)
  }

  const handleNotes = (e) => {
    setCurrNote(e.target.value)
  }

  const saveForm = _ => {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (addressList.length === 0) {
      alert('Please enter/add a street name');
      return;
    }
    storeRouteData(routeName, houseNumbers, volNotes, cityName);
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div container className={classes.pageContainer}>
        <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>New Route</Typography></div>
        <div className={classes.gridContainer}>
          <div className={classes.gridRequired}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField fullWidth variant="filled" error={!isValidName}
                  value={routeName} onChange={handleRoute}
                  label={<span>Name<span style={{ color: '#AA0000' }}>*</span></span>} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant="filled" error={!isValidCity}
                  value={cityName} onChange={handleCity}
                  label={<span>Town/City<span style={{ color: '#AA0000' }}>*</span></span>} />
              </Grid>
              <Grid item xs={12}>
                <DualGroupedTextField buttonLabel="ADD" buttonColor="primary" error={!isValidStreet}
                  label1={<span>Street Name<span style={{ color: '#AA0000' }}>*</span></span>} value1={currStreet} onChange1={handleStreet}
                  label2={<span>House Number<span style={{ color: '#AA0000' }}>*</span></span>} value2={currHouses} onChange2={handleAddress}
                  list={addressList}
                  helperText1="Street Name Only"
                  helperText2="Comma Seperated"
                  onButtonClick={updateStreetList}
                />
                {addressList.length > 0 ? <ChipList color="primary" list={addressList} onDelete={removeStreet} /> : null}
              </Grid>
            </Grid>
          </div>
          <div className={classes.gridMap}>
            <Map address={houseNumbers} width={'100%'} height={'500px'} cityState={["Chapel Hill, NC"]} />
          </div>
          <div className={classes.gridOld}>
            <Grid container spacing={3}>
              <Grid item xs={12}><h1>Previous Canning Data</h1></Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant="filled"
                  value={canningDate} onChange={handleDates}
                  onBlur={handleDateBlur} onFocus={handleDateFocus}
                  label="Date" helperText="MM/DD/YY" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth variant="filled"
                  value={numDonated} onChange={handleDonated}
                  label="$ Donations"
                />
              </Grid>
              <Grid item xs={12}>
                <GroupedTextField label="Volunteer Notes" buttonLabel="ADD" buttonColor="primary"
                  fieldValue={currNote} onChange={handleNotes} onButtonClick={updateNoteList}
                />
                {volNotes.length > 0 ? <ChipList color="default" list={volNotes} onDelete={removeNote} /> : null}
              </Grid>
            </Grid>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <div className={classes.formButton}><Link to={ROUTES.ADMIN_ROUTES} component={PillButton}>Cancel</Link></div>
          <div className={classes.formButton}><PillButton variant="contained" color="primary" onClick={saveForm} disabled={!validForm}>
            Save
          </PillButton></div>
        </div>
      </div>

    </ThemeProvider >
  );
};

export default NewRoutePanel;

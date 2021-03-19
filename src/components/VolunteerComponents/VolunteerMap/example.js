import React, { useState } from 'react';
import VolunteerNavBar from '../VolunteerNavBar';
import MobileMap from '../../RoutesComponents/Map/mobileMap';
import { TextField, Paper, IconButton, InputAdornment, Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

function ExampleMap() {

    const styleExample = {
        bottom: '0px'
    }
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [addressData, setAddressData] = useState({});

    function handleSearch() {
        setSearch(input);
        setInput("");
    }

    function handleInput(e) {
        setInput(e.target.value);
    }

    function handleIconClick(addressData) {
        // addressData is an object with 3 fields: key, street, city
        // key holds the house number
        // street holds the street name
        // city holds the city name

        // This example function makes it so that when you click a house Icon, you trigger something
        console.log(addressData);
        setAddressData(addressData);
    }

    function handleDialogClose() {
        // Closes dialog
        setAddressData({});
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <MobileMap width={'100%'} height={'calc(100vh - 72px)'} innerStyle={styleExample} routeId={search} onClickIcon={handleIconClick}>
                {/* To put a component on top of the map, put it inside the MobileMap component. The innerStyle prop allows for limited styling of inner component */}
                {/* You can use the absolute positioning to position the element within the map relative to the map itself */}
                <Paper style={{ width: 'calc(100vw - 20px)', margin: '10px', padding: '10px' }}>
                    <TextField
                        fullWidth
                        value={input}
                        onChange={handleInput}
                        InputProps={{
                            endAdornment: <InputAdornment><IconButton onClick={handleSearch}><SearchIcon></SearchIcon></IconButton></InputAdornment>
                        }}
                    ></TextField>
                </Paper>
            </MobileMap>
            <VolunteerNavBar tab="route-map"></VolunteerNavBar>
            {/* This is just a dialog to show that clicking an icon can open something */}
            <Dialog open={Object.keys(addressData).length > 0}>
                <DialogTitle>{`${addressData.key} ${addressData.street}, ${addressData.city}`}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ExampleMap;
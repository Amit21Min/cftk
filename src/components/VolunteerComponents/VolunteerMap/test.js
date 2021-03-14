import React, { useState } from 'react';
import VolunteerNavBar from '../VolunteerNavBar';
import MobileMap from '../../RoutesComponents/Map/mobileMap';
import { TextField, Paper, IconButton, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

function VolunteerRoute() {

    const styleExample = {
        bottom: '0px'
    }
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");

    function handleSearch() {
        setSearch(input);
        setInput("");
    }

    function handleInput(e) {
        setInput(e.target.value);
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <MobileMap width={'100%'} height={'calc(100vh - 72px)'} innerStyle={styleExample} routeId={search}>
                {/* To put a component on top of the map, put it inside the MobileMap component. The innerStyle prop allows for limited styling of inner component */}
                <Paper style={{ width: 'calc(100vw - 20px)', margin: '10px', padding: '10px' }}>
                    <TextField
                        fullWidth
                        value={input}
                        onChange={handleInput}
                        InputProps={{
                            endAdornment: <InputAdornment><IconButton><SearchIcon onClick={handleSearch}></SearchIcon></IconButton></InputAdornment>
                        }}
                    ></TextField>
                </Paper>
            </MobileMap>
            <VolunteerNavBar tab="route-map"></VolunteerNavBar>
        </div>
    )
}

export default VolunteerRoute;
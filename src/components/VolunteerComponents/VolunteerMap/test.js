import React, { useState } from 'react';
import VolunteerNavBar from '../VolunteerNavBar';
import MobileMap from '../../RoutesComponents/Map/mobileMap'
import { Input, Paper } from '@material-ui/core'

function VolunteerRoute() {

    const styleExample = {
        bottom: '100px'
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <MobileMap width={'100%'} height={'calc(100vh - 72px)'} innerStyle={styleExample}>
                {/* To put a component on top of the map, put it inside the MobileMap component. The innerStyle prop allows for limited styling of inner component */}
                <Paper style={{width: 'calc(100vw - 20px)', margin: '10px', padding: '10px'}}>
                    <Input fullWidth></Input>
                </Paper>
            </MobileMap>
            <VolunteerNavBar tab="route-map"></VolunteerNavBar>
        </div>
    )
}

export default VolunteerRoute;
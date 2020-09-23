import React from 'react';
import { Chip } from '@material-ui/core';


const ChipList = (props) => {

    return (
        <div>
            {props.list.map(item => (
                <Chip key={item} color={props.color} label={item} style={{marginRight: 4}}
                    onClick={props.onClick} onDelete={() => props.onDelete(item)}
                />
            ))}
        </div>
    );
};

export default ChipList;

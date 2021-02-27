import React from 'react';
import { Chip } from '@material-ui/core';


const ChipList = (props) => {

    return (
        <div>
            {props.list.map((item, index) => (
                <Chip key={index} color={props.color} label={item} style={{margin: 6}}
                    onClick={() => {if (props.onClick) props.onClick(item)}} onDelete={() => {if (props.onDelete) props.onDelete(item)}}
                />
            ))}
        </div>
    );
};

export default ChipList;

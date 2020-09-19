import React from 'react';
import './styles.css';



const DeleteDialogs = () => {

    return (
        <div className="dialogue">
            <h1 className="title">Delete Street</h1>
            <p>Are you sure you want to delete the street, [Insert Street Name]</p>
            <div className="buttons">
                <button className="button">Cancel</button>
                <button className="button">Delete</button>
            </div>
        </div>

    )
};

export default DeleteDialogs;
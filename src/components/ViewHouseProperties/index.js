import React from 'react';
import './style.css'

const ViewHouseProperties = () => (
    <div>
        <h2>View House Properties</h2>
        <div className="google_map">
        <iframe
            width="450"
            height="450"
            //frameborder="0" style="border:0"
            //need to figure out src
            src="" allowfullscreen
            >
        </iframe>
        </div>
        <div className="notes">
            <p>
                Notes
            </p>
        </div>
        <div class="clearfix"></div>
    </div>
);

export default ViewHouseProperties;
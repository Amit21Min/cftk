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
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBW0YGFoGCr0qKjZYJOq9zMNfcaZVHtFaQ
            &q=Space+Needle,Seattle+WA" allowfullscreen>
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
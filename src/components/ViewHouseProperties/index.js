import React from 'react';
import './style.css'
import SearchBar from '../SearchBar'

const ViewHouseProperties = () => (
    <div>
        <h2 className="title">View House Properties</h2>
        <SearchBar prompt="Search house number"/>
        <label className="label">Or select a house on the map</label>
        <div className="google_map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107783.61502174675!2d-79.11087714158613!3d35.92176837835235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acc31c216e7ea7%3A0x7f03bae00443e4cb!2sChapel%20Hill%2C%20NC!5e0!3m2!1sen!2sus!4v1599245010514!5m2!1sen!2sus"
       //  width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"
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
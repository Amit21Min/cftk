import React from "react";
import { useGoogleMaps } from "react-hook-google-maps";

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

export const Map = React.memo(function Map(props) {
  console.log(props);
  const { ref, map, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 4,
      center: { lat: 35.9132, lng: 79.0558 }
    },
  );
  console.log("render MapWithMarkers");

  if (map) {
    // execute when map object is ready
    var geocoder = new google.maps.Geocoder();
    var addresses = props.address;
    var cityState = props.cityState;

    for (var street in addresses) {
      for (var i = 0; i < addresses[street].length; i++) {
        var fullAddress = addresses[street][i] + " " + street + "," + cityState;
        codeAddress(geocoder, map, fullAddress);
      }
    };
    var iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/'
    var parkingIcon = iconBase + 'parking_lot_maps.png'
    // address = address.map(address => address + ", " + cityState);

    // Most accurate Geocoder result achieved with supplying sa much of the following as possible:
    // House Number, Street Direction, Street Name, Street Suffix, City, State, Zip, Country
  }

  function codeAddress(geocoder, resultsMap, address) {    
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        var curmarker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon : parkingIcon
        });
        resultsMap.setZoom(18);
        resultsMap.panTo(curmarker.position);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  return (
    <div>
      <span>
        Example from{" "}
        <a href="https://developers.google.com/maps/documentation/javascript/adding-a-google-map">
          https://developers.google.com/maps/documentation/javascript/adding-a-google-map
        </a>
      </span>
      <div ref={ref} style={{ width: 400, height: 300 }} />
    </div>
  );
  
}, (prevProps, nextProps) => {
  const lodash = require("lodash");
  if (lodash.isEqual(prevProps, nextProps)) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
});
import { CropPortrait } from "@material-ui/icons";
import React from "react";
import { useGoogleMaps } from "react-hook-google-maps";

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

export const Map = React.memo(function Map(props) {
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
    var streets = props.streets;
    var city = props.city;
    var state = props.state;
    var addresses = props.address;

    // Housenumbers looks like:
// {
//     street1: [123,124,125],
//     street2: [1,2,3,4]
// }

  var cityState = props.cityState;
  for (var street in addresses) {
    console.log(street);
    console.log(addresses);
    console.log(addresses[street]);
    for (var address in addresses[street]) {
      console.log(addresses[street][address]);
      var fullAddress = addresses[street][address] + " " + street + "," + cityState;
      console.log(fullAddress);
      codeAddress(geocoder, map, fullAddress);
    }

    // console.log(street);
    // console.log(address[street]);
  }
    var cityState = props.cityState;
    var iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/'
    var parkingIcon = iconBase + 'parking_lot_maps.png'
    // address = address.map(address => address + ", " + cityState);
    
    // address.forEach(address => codeAddress(geocoder, map, address));

    // Most accurate Geocoder result achieved with supplying sa much of the following as possible:
    // House Number, Street Direction, Street Name, Street Suffix, City, State, Zip, Country
  }

  function codeAddress(geocoder, resultsMap, address) {
    console.log(address);
    console.log(parkingIcon);
    
    geocoder.geocode({ address: address }, (results, status) => {
      console.log(results[0].geometry.location);
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
});
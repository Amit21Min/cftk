// import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import houseDefault from "../../../assets/images/MapIcons/houseDefault.svg";
import houseDefaultSelected from "../../../assets/images/MapIcons/houseDefaultSelected.svg";

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

function useFlatAddress(addresses) {
  // Custom hook that splits the addresses object into 3 lists, the new ones that were added, the ones that were removed, and the currently existing ones
  const [markerCoords, setMarkerCoords] = useState([]);

  useEffect(() => {
    let temp = [];
    for (let street in addresses) {
      for (let address in addresses[street]) {
        temp.push(addresses[street][address]);
      }
    }

    setMarkerCoords(temp);

  }, [JSON.stringify(addresses)]);

  return markerCoords
}
// To look at in the future, use snap to roads api to convert addresses to a road, but API key seems to be rejected
// function useSnappedRoads(addresses) {

//   const [roads, setRoads] = useState({});

//   useEffect(() => {
//     let snapPromises = []
//     for (let street in addresses) {
//       if (!roads[street] || Object.keys(addresses[street]) != Object.keys(roads[street])) {
//         let streetCoords = []
//         for (let address in addresses[street]) {
//           streetCoords.push(`${addresses[street][address].lat},${addresses[street][address].lng}`)
//         }
//         snapPromises.push(fetch('https://roads.googleapis.com/v1/snapToRoads', {
//           interpolate: true,
//           key: process.env.REACT_APP_MAPS_API_KEY,
//           path: streetCoords.join('|')
//         }))
//       }
//     }
//     Promise.all(snapPromises).then(res => console.log(res))
//   }, [JSON.stringify(addresses)])
// }

function Map(props) {
  const defaultLoc = { lat: 35.9132, lng: -79.0558 }
  const { ref, map, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 18,
      center: defaultLoc
    },
  );
  const coords = useFlatAddress(props.addresses);
  // const roads = useSnappedRoads(props.addresses);
  function createMarkerListeners(marker) {
    const markerIn = marker.addListener('mouseover', function() {
      // Action on the way in
      marker.setIcon(houseDefaultSelected)
    });
    const markerOut = marker.addListener('mouseout', function() {
      // Reset on the way out
      marker.setIcon(houseDefault)
    });
    const markerClick = marker.addListener('click', function() {
      // Action on click
      console.log('click');
    })
    return [markerIn, markerOut, markerClick]
  }

  useEffect(() => {

    // Exit if the map or google objects are not yet ready
    if (!map || !google || coords.length === 0) return;


    let tempMarkers = []
    for (let address of coords) {
      const marker = new google.maps.Marker({
        map: map,
        position: address,
        icon: houseDefault
      });
      createMarkerListeners(marker);
      tempMarkers.push(marker);
    }

    return function cleanup() {
      for (let marker of tempMarkers) {
        marker.setMap(null);
      }
    }

  }, [coords, map, google]);

  useEffect(() => {

    if (!map || !google) return;

    function trackLocation({ onSuccess, onError = () => { } }) {
      if (!navigator.geolocation) {
        return onError(new Error('Geolocation is not supported by your browser.'));
      }
    
      // Use watchPosition instead.
      return navigator.geolocation.watchPosition(onSuccess, onError);
    };

    function getPositionErrorMessage(code) {
      switch (code) {
        case 1:
          return 'Permission denied.';
        case 2:
          return 'Position unavailable.';
        case 3:
          return 'Timeout reached.';
        default:
          return null;
      }
    }

    const marker = new google.maps.Marker({
      map: map,
      position: defaultLoc
    });

    const tracker = trackLocation({
      onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
        marker.setPosition({ lat, lng });
        map.panTo({ lat, lng });
      },
      onError: err =>
        alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
    });

    return function cleanup() {
        if (navigator.geolocation) navigator.geolocation.clearWatch(tracker)
    }

  }, [google, map])

  return (
    <div>
      {/* <span>
            Example from{" "}
            <a href="https://developers.google.com/maps/documentation/javascript/adding-a-google-map">
              https://developers.google.com/maps/documentation/javascript/adding-a-google-map
            </a>
          </span> */}
      <div ref={ref} style={{ width: props.width, height: props.height }} />
    </div>
  );
}

export default Map;
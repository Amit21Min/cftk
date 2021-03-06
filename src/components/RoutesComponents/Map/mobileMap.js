// import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";

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
<svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32.5333" cy="32.5333" r="32.5333" fill="#6D6E71"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M44.4561 32.6485C44.1738 36.4909 45.1214 41.6067 43.8984 44.5229C37.2751 45.4808 26.757 45.4808 20.1368 44.5229C18.9233 41.6904 19.858 36.6899 19.5672 32.94C18.5147 32.4346 16.601 32.8222 16.3844 31.4915C16.0275 28.6266 18.6877 28.7691 19.5672 27.1437C19.6726 24.8563 19.1923 21.9485 20.1368 20.4962C22.0663 19.9515 22.995 19.8833 24.7754 20.4962C25.2702 20.9604 25.4931 21.7006 25.3602 22.8093C28.2219 22.6261 28.8194 18.4615 32.0109 18.4615C33.8311 18.4615 38.8044 23.0351 40.4122 24.2525C43.0221 26.2084 52.3109 31.686 44.4561 32.6485Z" stroke="white" stroke-width="2"/>
</svg>

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

  useEffect(() => {

    // Exit if the map or google objects are not yet ready
    if (!map || !google || coords.length === 0) return;

    const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
    const parkingIcon = iconBase + 'parking_lot_maps.png';

    let tempMarkers = []
    for (let address of coords) {
      tempMarkers.push(new google.maps.Marker({
        map: map,
        position: address,
        icon: parkingIcon
      }));
    }

    return function cleanup() {
      for (let marker of tempMarkers) {
        marker.setMap(null);
      }
    }

  }, [coords, map, google]);

  useEffect(() => {

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
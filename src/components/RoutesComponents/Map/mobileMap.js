// import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import houseDefault from "../../../assets/images/MapIcons/houseDefault.svg";
import houseDefaultSelected from "../../../assets/images/MapIcons/houseDefaultSelected.svg";
import { getMapAddresses } from '../ReusableComponents/RouteModels/routes';

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

function useFirebaseStreetInfo(routeName) {
  // Custom hook that splits the addresses object into 3 lists, the new ones that were added, the ones that were removed, and the currently existing ones
  const [streetInfo, setStreetInfo] = useState({});

  useEffect(() => {
    getMapAddresses(routeName).then(newInfo => {
      setStreetInfo({
        routeName,
        streetData: newInfo
      })
    })
  }, [routeName]);

  return streetInfo
}


function Map(props) {
  const defaultLoc = { lat: 35.9132, lng: -79.0558 }
  const { ref, map, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 18,
      center: defaultLoc
    },
  );
  const { routeName, streetData } = useFirebaseStreetInfo(props.routeId || "Lucas1");
  // const roads = useSnappedRoads(props.addresses);
  function createMarkerListeners(marker) {
    const markerIn = marker.addListener('mouseover', function () {
      // Action on the way in
      marker.setIcon(houseDefaultSelected)
    });
    const markerOut = marker.addListener('mouseout', function () {
      // Reset on the way out
      marker.setIcon(houseDefault)
    });
    const markerClick = marker.addListener('click', function () {
      // Action on click
      console.log('click');
    })
    return [markerIn, markerOut, markerClick]
  }

  useEffect(() => {

    // Exit if the map or google objects are not yet ready
    if (!map || !google || !streetData || streetData.length === 0) return;

    let tempMarkers = [];
    for (let street of streetData) {
      for (let [key, value] of Object.entries(street.addresses)) {
        // console.log(`${key} ${street.name}, ${street.city}`);
        const marker = new google.maps.Marker({
          map: map,
          position: value,
          icon: houseDefault
        });
        createMarkerListeners(marker);
        tempMarkers.push(marker);
      }
    }

    // let tempMarkers = []
    // for (let address of streetInfo) {
    //   const marker = new google.maps.Marker({
    //     map: map,
    //     position: address,
    //     icon: houseDefault
    //   });
    //   createMarkerListeners(marker);
    //   tempMarkers.push(marker);
    // }

    return function cleanup() {
      for (let marker of tempMarkers) {
        marker.setMap(null);
      }
    }

  }, [streetData, map, google, routeName]);

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
      position: defaultLoc,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#0075A3",
        strokeColor: "#FFFFFF",
        fillOpacity: 1,
        strokeWeight: 3
      },
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

  }, [google, map]);

  const innerStyle = props.innerStyle ? props.innerStyle : { bottom: '0px' };

  return (
    <div style={{ position: 'relative' }}>
      {/* <span>
            Example from{" "}
            <a href="https://developers.google.com/maps/documentation/javascript/adding-a-google-map">
              https://developers.google.com/maps/documentation/javascript/adding-a-google-map
            </a>
          </span> */}
      <div ref={ref} style={{ width: props.width, height: props.height }} />
      {props.children ? <div style={{ position: 'absolute', ...innerStyle }}>
        {props.children}
      </div> : null}
    </div>
  );
}

export default Map;
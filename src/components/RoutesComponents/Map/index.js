// import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

function useAddressLists(addresses, city) {
  // Custom hook that splits the addresses object into 3 lists, the new ones that were added, the ones that were removed, and the currently existing ones
  const [addr, setAddr] = useState({
    added: [],
    removed: [],
    current: []
  });

  useEffect(() => {
    let current = [];
    const prevAddr = addr.current;
    for (let street in addresses) {
      for (let address of addresses[street]) {
        current.push(`${address} ${street},${city}`);
      }
    }
    let added = current.filter(address => !prevAddr.includes(address));
    let removed = prevAddr.filter(address => !current.includes(address));

    setAddr({
      added,
      removed,
      current
    });

  }, [JSON.stringify(addresses)]);

  return addr
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
  const { added, removed, current } = useAddressLists(props.addresses, props.cityState);
  const [markers, setMarkers] = useState({});

  useEffect(() => {

    function codeAddress(geocoder, address) {
      // geocoder has a limit of about 10 requests per second, need to find solution for longer lists
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          let newMarker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: parkingIcon
          });
          newMarkers[address] = newMarker;
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    // Exit if the map or google objects are not yet ready
    if (!map || !google) return;

    let newMarkers = markers;
    const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
    const parkingIcon = iconBase + 'parking_lot_maps.png';

    // Add only the markers that are new
    const geocoder = new google.maps.Geocoder();
    for (let address of added) {
      codeAddress(geocoder, address)
    }
    
    // Remove all markers that are no longer there
    for (let addr of removed) {
      if (newMarkers[addr] && newMarkers[addr].setMap) {
        newMarkers[addr].setMap(null);
        delete newMarkers[addr]
      }
    }

    // Pan to the last marker
    let lastLocation = defaultLoc;
    if (current.length > 0 && newMarkers[current[current.length - 1]]) lastLocation = newMarkers[current[0]].position;
    map.setCenter(lastLocation);
    map.panTo(lastLocation);

    setMarkers(newMarkers)

  }, [added, removed, current, map, google]);

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
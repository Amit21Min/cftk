import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";

// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

function useAddressLists(addresses, city) {
  const [prevAddr, setPrevAddr] = useState([]);
  const [addr, setAddr] = useState({
    added: [],
    removed: []
  });

  useEffect(() => {
    let flatAddr = [];
    for (let street in addresses) {
      for (let address of addresses[street]) {
        flatAddr.push(`${address} ${street},${city}`);
      }
    }
    let added = flatAddr.filter(address => !prevAddr.includes(address))
    let removed = prevAddr.filter(address => !flatAddr.includes(address))

    setPrevAddr(flatAddr);
    setAddr({
      added,
      removed
    });

  }, [JSON.stringify(addresses)]);

  return addr
}

function Map(props) {
  const { ref, map, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 18,
      center: { lat: 35.9132, lng: -79.0558 }
    },
  );
  const { added, removed } = useAddressLists(props.addresses, props.cityState);
  const [markers, setMarkers] = useState({});

  useEffect(() => {

    function codeAddress(geocoder, address) {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          let newMarker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: parkingIcon
          });
          newMarkers[address] = newMarker;
          lastLocation = results[0].geometry.location
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    if (!map || !google) return;

    let newMarkers = markers;
    let lastLocation = { lat: 35.9132, lng: -79.0558 };
    const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
    const parkingIcon = iconBase + 'parking_lot_maps.png';

    const geocoder = new google.maps.Geocoder();
    for (let address of added) {
      codeAddress(geocoder, address)
    }
    map.setCenter(lastLocation);
    map.panTo(lastLocation);

    for (let addr of removed) {
      if (newMarkers[addr] && newMarkers[addr].setMap) {
        newMarkers[addr].setMap(null);
        delete newMarkers[addr]
      }
    }
    setMarkers(newMarkers)

  }, [added, removed, map, google]);

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
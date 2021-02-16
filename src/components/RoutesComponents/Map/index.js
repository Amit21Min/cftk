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

    // Exit if the map or google objects are not yet ready
    if (!map || !google) return;

    let newMarkers = markers;
    const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
    const parkingIcon = iconBase + 'parking_lot_maps.png';

    // Add only the markers that are new
    const geocoder = new google.maps.Geocoder();

    for (let address of added) {
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

  // useEffect(() => {
  //   // Allows for adding markers on map click
  //   if (!map) return;
  //   const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
  //   const parkingIcon = iconBase + 'parking_lot_maps.png';
  //   const geocoder = new google.maps.Geocoder();
  //   let mapListener = map.addListener("click", (mapsMouseEvent) => {
  //     let clickLoc = mapsMouseEvent.latLng;
  //     let newMarker = new google.maps.Marker({
  //       position: clickLoc,
  //       icon: parkingIcon
  //     });
  //     geocoder.geocode({ location: clickLoc }, (results, status) => {
  //       if (status === "OK") {
  //         if (results[0]) {
  //           // Reverse geocodes the coordinates to an address
  //           let formatted = results[0].formatted_address
  //           setMarkers2(prevState => {
  //             if (prevState[formatted]) {
  //               console.log('address already stored')
  //               newMarker.setMap(null);
  //               return prevState;
  //             }
  //             let newState = {
  //               ...prevState,
  //               [formatted]: clickLoc.toJSON()
  //             };
  //             let markerListener = newMarker.addListener("click", () => {
  //               // Removes the listener and clears the address from the state
  //               newMarker.setMap(null);
  //               // The most convoluted code I've written lately. It has a setState within another setState. Probably should look into useReducer or something
  //               // Update, useReducer does not work because reducers must be pure, and this sure ain't gonna be pure
  //               setMarkers2(prevState => {
  //                 delete prevState[formatted]
  //                 return prevState;
  //               })
  //               google.maps.event.clearInstanceListeners(markerListener);
  //             });
  //             newMarker.setMap(map)
  //             return newState
  //           })
  //         } else {
  //           window.alert("No results found");
  //         }
  //       } else {
  //         window.alert("Geocoder failed due to: " + status);
  //       }
  //     });    
  //   });

  //   return function cleanup() {
  //     if (google) {
  //       google.maps.event.clearInstanceListeners(mapListener)
  //     }
  //   }
  // }, [map, google]);

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
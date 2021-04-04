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

    map.panTo(coords[0]);

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
        google.maps.event.clearInstanceListeners(marker);
        marker = null;
      }
    }

  }, [coords, map, google]);

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
import { useEffect, useRef } from "react";
import leaflet from "leaflet";
import useLocalStorage from "../hooks/useLocalStorage";
import useGeolocation from "../hooks/useGeolocation";
import useNearbyCaptains from "../hooks/useNearbyCaptains";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const mapContainerRef = useRef(null); // DOM node for map
  const mapInstanceRef = useRef(null); // Leaflet map instance
  const userMarkerRef = useRef();
  const markersRef = useRef([]);

  const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
    latitude: 0,
    longitude: 0,
  });

  const [nearbyMarkers, setNearbyMarkers] = useLocalStorage(
    "NEARBY_MARKERS",
    []
  );

  const location = useGeolocation();

  const lat = location ? location.latitude : null;
  const lng = location ? location.longitude : null;

  const captains = useNearbyCaptains(
    lat,
    lng,
    1000
  ); // 100000 meters = 100 km

  useEffect(() => {
    if (
      mapContainerRef.current &&
      !mapInstanceRef.current &&
      typeof userPosition.latitude === "number" &&
      typeof userPosition.longitude === "number" &&
      !isNaN(userPosition.latitude) &&
      !isNaN(userPosition.longitude)
    ) {
      mapInstanceRef.current = leaflet
        .map(mapContainerRef.current)
        .setView([userPosition.latitude, userPosition.longitude], 13);

      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(mapInstanceRef.current);

      // Remove the following block to disable user-added markers:
      // nearbyMarkers.forEach(({ latitude, longitude }) => {
      //   leaflet
      //     .marker([latitude, longitude])
      //     .addTo(mapInstanceRef.current)
      //     .bindPopup(
      //       `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
      //     );
      // });

      // Remove the click handler to prevent adding markers on map click:
      // mapInstanceRef.current.on("click", (e) => {
      //   const { lat: latitude, lng: longitude } = e.latlng;
      //   leaflet
      //     .marker([latitude, longitude])
      //     .addTo(mapInstanceRef.current)
      //     .bindPopup(
      //       `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
      //     );
      //
      //   setNearbyMarkers((prevMarkers) => [
      //     ...prevMarkers,
      //     { latitude, longitude },
      //   ]);
      // });
    }
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number" ||
      isNaN(location.latitude) ||
      isNaN(location.longitude) ||
      !mapInstanceRef.current
    ) {
      return;
    }

    // Remove previous marker if it exists
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    // Add new marker at current geolocation
    userMarkerRef.current = leaflet
      .marker([location.latitude, location.longitude])
      .addTo(mapInstanceRef.current)
      .bindPopup("User");

    const el = userMarkerRef.current.getElement();
    if (el) {
      el.style.filter = "hue-rotate(180deg)"; // Change marker color to red
    }

    // Move map view to user location
    mapInstanceRef.current.setView([location.latitude, location.longitude], 13);
  }, [location]);

  useEffect(() => {
    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!mapInstanceRef.current || !captains.length) return;

    captains.forEach((captain) => {
      const lat = captain.location?.lat;
      const lng = captain.location?.lng;
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        !isNaN(lat) &&
        !isNaN(lng)
      ) {
        const marker = leaflet
          .marker([lat, lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(`Captain lat: ${lat.toFixed(2)}, long: ${lng.toFixed(2)}`);
        markersRef.current.push(marker);
      }
    });
  }, [captains]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      leaflet
        .marker([23.2491, 87.8694])
        .addTo(mapInstanceRef.current)
        .bindPopup("Test Marker");
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: 0,
      }}
    ></div>
  );
}

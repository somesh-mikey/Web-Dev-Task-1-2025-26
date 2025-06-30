import { useState, useEffect } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const onSuccess = (pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };

    const onError = () => {
      setPosition(null);
    };

    const watcher = navigator.geolocation.getCurrentPosition(onSuccess, onError);

    return () => {
      if (watcher && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, []);

  return position;
}

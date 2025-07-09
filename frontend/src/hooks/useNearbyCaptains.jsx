import { useEffect, useState } from "react";
import axios from "axios";

export default function useNearbyCaptains(lat, lng, radius = 1000) {
  const [captains, setCaptains] = useState([]);
  useEffect(() => {
    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/maps/nearby-captains`, {
          params: { lat, lng, radius },
        })
        .then((res) => setCaptains(res.data))
        .catch(() => setCaptains([]));
    }
  }, [lat, lng, radius]);
  return captains;
}

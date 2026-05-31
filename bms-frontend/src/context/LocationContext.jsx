import { createContext,useContext, useState, useEffect  } from "react";

const LocationContext = createContext();

export const LocationProvide = ({children})=>{
    const [location,setLocation] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
  const cached = localStorage.getItem("location");
  if (cached) {
    setLocation(cached);
    setLoading(false);
    return;
  }

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const data = await res.json();

      const userLocation =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village;

      setLocation(userLocation);
      localStorage.setItem("location", userLocation);
    } catch (err) {
      setError("Failed to fetch location data");
    } finally {
      setLoading(false);
    }
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchLocationData(latitude, longitude);
    },
    () => {
      setError("Unable to retrieve your location");
      setLoading(false);
    }
  );
}, []);
    return(
        <LocationContext.Provider value={{location,loading,error}}>
            {children}</LocationContext.Provider>
    )
}

export const useLocation =() =>useContext(LocationContext);
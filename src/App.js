import { useRef } from "react";
import NavBar from "./components/navbar";
import MapView from "./components/map";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const App = () => {
  /**
   * Load Google Maps Script and include Places Library
   */
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });
  /**
   * Set empty Ref to Map to use in components
   */
  const mapRef = useRef();

  return (
    <>
      <NavBar isLoaded={isLoaded} loadError={loadError} mapRef={mapRef} />
      <MapView isLoaded={isLoaded} loadError={loadError} mapRef={mapRef} />
    </>
  );
};

export default App;

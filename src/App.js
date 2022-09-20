import { useRef } from "react";
import NavBar from "./components/navbar";
import MapView from "./components/map";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCFAz90pyBmuPoviIAu84HZYRr4u0DT5OU",
    libraries,
  });

  const mapRef = useRef();

  return (
    <>
      <NavBar isLoaded={isLoaded} loadError={loadError} mapRef={mapRef} />
      <MapView isLoaded={isLoaded} loadError={loadError} mapRef={mapRef} />
    </>
  );
};

export default App;

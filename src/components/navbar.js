import { useState, useCallback } from "react";
import { Container, Navbar } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import "../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = ({ isLoaded, mapRef }) => {
  const [address, setAddress] = useState(null);
  /**
   *  Get Input Text from Places Autocomplete, GeoCode and then get Lat/Lng
   */
  const handleChange = async (value) => {
    const results = await geocodeByAddress(value.label);
    const { lat, lng } = await getLatLng(results[0]);
    panTo({ lat, lng });
  };
  /**
   * Pan To Coordinates on Map and Zoom in on location
   */
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);
  /**
   * Return JSX
   */
  return (
    <div className="navBar">
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/fiber.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Fiber Finder
          </Navbar.Brand>
          {isLoaded && (
            <GooglePlacesAutocomplete
              selectProps={{
                value: address,
                onChange: handleChange,
                placeholder: "Address",
                styles: {
                  input: (provided) => ({
                    ...provided,
                    color: "blue",
                    width: 200,
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "blue",
                    width: 200,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "blue",
                    width: 200,
                  }),
                },
              }}
              autocompletionRequest={{
                location: { lat: 41.65, lng: -83.53 },
                radius: 100 * 100,
              }}
            />
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;

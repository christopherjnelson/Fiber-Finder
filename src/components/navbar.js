import { useState, useCallback } from "react";
import { Container, Navbar } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

import "../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = ({ isLoaded, loadError, mapRef }) => {
  const [address, setAddress] = useState(null);

  const handleChange = async (value) => {
    console.log(value);
    const results = await geocodeByAddress(value.label);
    const { lat, lng } = await getLatLng(results[0]);
    panTo({ lat, lng });
  };

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

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
                    width: 150,
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "blue",
                    width: 150,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "blue",
                    width: 150,
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

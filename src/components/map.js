import { useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Button, Container, Stack } from "react-bootstrap";
import { supabase } from "../lib/api";
import mapStyles from "../styles/mapStyles";
/**
 * Add Custom Styles to Map
 */
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
/**
 * Center the Map on NW Ohio
 */
const center = {
  lat: 41.652805,
  lng: -83.5378652,
};

const MapView = ({ isLoaded, loadError, mapRef }) => {
  const [markers, setMarkers] = useState([]);
  const [mapSelected, setMapSelected] = useState(null);
  const [pinSelected, setPinSelected] = useState(null);
  /**
   * Call FetchMarkers when component first loads
   */
  useEffect(() => {
    fetchMarkers();
  }, []);
  /**
   * Add Marker to Supabase DB and update markers state
   */
  const addMarker = async (e) => {
    try {
      let { error, data } = await supabase
        .from("places")
        .insert({
          lat: mapSelected.lat(),
          lng: mapSelected.lng(),
          isp: e.target.innerText,
        })
        .single();

      if (error) throw error;
      setMapSelected(null);
      setMarkers([...markers, data]);
    } catch (error) {
      console.log("error", error);
    }
  };
  /**
   * Fetch Markers from Supabase and update state
   */
  const fetchMarkers = async () => {
    let { error, data } = await supabase.from("places").select().order("id");
    if (error) {
      console.log(error.message);
      return;
    }
    setMarkers(data);
  };
  /**
   * Event Handlers
   */
  const onMapClick = useCallback((e) => {
    setMapSelected(e.latLng);
  }, []);

  const onMarkerClick = useCallback((isp, lat, lng, created_at) => {
    setPinSelected({ isp, lat, lng, created_at });
  }, []);

  const onMapLoad = useCallback((map) => {
    console.log("set current ref");
    mapRef.current = map;
  }, []);

  /**
   * Return JSX
   */
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: marker.isp === "Buckeye" ? "/buckeye.png" : "/att.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            onClick={() =>
              onMarkerClick(
                marker.isp,
                marker.lat,
                marker.lng,
                marker.created_at
              )
            }
          />
        ))}
        {mapSelected && (
          <InfoWindow
            position={{ lat: mapSelected.lat(), lng: mapSelected.lng() }}
            onCloseClick={() => {
              setMapSelected(null);
            }}
          >
            <div>
              <h2>Got Fiber?</h2>
              <Container>
                <Stack direction="horizontal" gap={2}>
                  <Button onClick={addMarker}>Buckeye</Button>
                  <Button onClick={addMarker}>ATT</Button>
                </Stack>
              </Container>
            </div>
          </InfoWindow>
        )}
        {pinSelected && (
          <InfoWindow
            position={{ lat: pinSelected.lat, lng: pinSelected.lng }}
            onCloseClick={() => {
              setPinSelected(null);
            }}
          >
            <div>
              <h2>{pinSelected.isp}</h2>
              <p>Created: {pinSelected.created_at}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;

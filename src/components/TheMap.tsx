import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl";
import { observer } from "mobx-react";
import { Layout } from "@/store";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWctdG9hc3QiLCJhIjoiY2wxZm0wbHBzMDA1bzNvb2N3NWduNjFteCJ9.eWLrKxjUPw8KQC1N2tv3_Q";
interface Props {
  layout: Layout;
}
const TheMap = observer(({ layout }: Props) => (
  <div id="map-container">
    <Map
      initialViewState={{
        longitude: -6.251023,
        latitude: 53.339612,
        zoom: 12.1129,
      }}
      attributionControl={false}
      mapStyle={
        layout.darkMode
          ? "mapbox://styles/mapbox/dark-v10"
          : "mapbox://styles/mapbox/light-v10"
      }
    />
  </div>
));
export default TheMap;

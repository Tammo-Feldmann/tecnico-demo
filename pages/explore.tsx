import { useRef } from "react";
import { SimpleMap } from "../components/explore/mapbox/map";
import { Map as MapboxMap, MapboxOptions as mapOptions } from "mapbox-gl";

interface ExploreProps {}

const ExplorePage: React.FC<ExploreProps> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1>Tecnico Demo Map with Buildings</h1>
      <SimpleMap
        className="root"
        mapRef={mapRef}
        containerRef={mapContainer}
        // onLoad={() => setMapLoaded(true)}
        // onMoveEnd={onPositionChange}
        mapOptions={{
          ...mapOptions,
        }}
        // withGeocoder={withGeocoder}
        // aoi={aoi}
        // onAoiChange={onAoiChange}
        // projection={projection}
        // onProjectionChange={onProjectionChange}
        // basemapStyleId={basemapStyleId}
        // onBasemapStyleIdChange={onBasemapStyleIdChange}
        // labelsOption={labelsOption}
        // boundariesOption={boundariesOption}
        // onOptionChange={onOptionChange}
      />
    </div>
  );
};

export default ExplorePage;

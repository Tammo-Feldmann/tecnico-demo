import React, {
  useEffect,
  RefObject,
  MutableRefObject,
  ReactElement,
} from "react";
import mapboxgl, {
  Map as MapboxMap,
  AttributionControl,
  EventData,
  MapboxOptions,
  NavigationControl,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import _polygon from "turf-polygon";
import _intersect from "@turf/intersect";

import { globalVariables } from "../../../global-config";

// import buildingData from "../tecnico_data_sample.json";
// import buildingData from "../tecnico_buildings.json";
import mapping from "../mb_building_mapping.json";

// Set mapbox token.
mapboxgl.accessToken = globalVariables.mbToken;

interface SimpleMapProps {
  [key: string]: unknown;
  mapRef: MutableRefObject<MapboxMap | null>;
  containerRef: RefObject<HTMLDivElement>;
  onLoad?(e: EventData): void;
  onMoveEnd?(e: EventData): void;
  onUnmount?: () => void;
  mapOptions: Partial<Omit<MapboxOptions, "container">>;
  withGeocoder?: boolean;
  // aoi?: AoiState;
  // onAoiChange?: AoiChangeListenerOverload;
  // projection?: ProjectionOptions;
  // onProjectionChange?: (projection: ProjectionOptions) => void;
  // basemapStyleId?: BasemapId;
  // onBasemapStyleIdChange?: (basemapId: BasemapId) => void;
  labelsOption?: boolean;
  boundariesOption?: boolean;
  // onOptionChange?: (option: Option, value: boolean) => void;
  attributionPosition?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | false;
}

export function SimpleMap(props: SimpleMapProps): ReactElement {
  const {
    mapRef,
    containerRef,
    onLoad,
    onMoveEnd,
    onUnmount,
    mapOptions,
    withGeocoder,
    aoi,
    onAoiChange,
    projection,
    onProjectionChange,
    attributionPosition = "bottom-left",
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange,
    ...rest
  } = props;

  //   const { data } = buildingData;
  useEffect(() => {
    if (!containerRef.current) return;

    const mbMap = new MapboxMap({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-9.102564138708317, 38.7350755295148],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
      ...mapOptions,
    });

    mapRef.current = mbMap;

    // Add zoom controls without compass.
    if (mapOptions?.interactive !== false) {
      mbMap.addControl(
        new NavigationControl({ showCompass: false }),
        "top-left"
      );
    }

    mbMap.on("style.load", () => {
      // Insert the layer beneath any symbol layer.
      const layers = mbMap.getStyle().layers;
      const labelLayerId = layers.find(
        layer => layer.type === "symbol" && layer.layout["text-field"]
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      mbMap.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          promoteId: "id",
          //   generateId: true,
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,

          paint: {
            "fill-extrusion-color": [
              //   "case",
              //   ["boolean", ["feature-state", "display"], false],
              //   "green",
              //   "#aaa",

              "interpolate-hcl",
              ["linear"],
              ["number", ["feature-state", "shading"], 0],
              0,
              "white",
              1,
              "green",
              100,
              "red",
            ],
            // "fill-extrusion-opacity": 0,

            //   "case",
            //   ["boolean", ["feature-state", "display"], false],
            //   "green",
            //   "#aaa",

            //   ["boolean", ["feature-state", "shading"], false],
            //   0,
            //   1,

            // "fill-extrusion-color": [
            //   "match",
            //   ["get", "id"],
            //   278093222,
            //   "red",
            //   "white",
            // ],
            // "fill-extrusion-color": [
            //   "match",
            //   ["get", "shading"],
            //   248771080,
            //   "green",
            //   "red",
            // ],

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              //   ["get", "height"],
              ["number", ["feature-state", "height"], ["get", "height"]],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });

    const featureSet = new Set();
    const collapseFeatureIds = [236085368, 1067239070];

    mbMap.on("click", function (e) {
      var features = mbMap.queryRenderedFeatures({
        layers: ["3d-buildings"],
      });

      // ***** Console.log a clicked feature.id
      const clickedFeature = mbMap.queryRenderedFeatures(e.point, {
        layers: ["3d-buildings"],
      });
      if (features[0]) {
        mbMap.setFeatureState(
          {
            source: "composite",
            sourceLayer: "building",
            id: features[0].id,
          },
          {
            height: 0,
          }
        );
        console.log(features[0].id);
      } else {
        console.log("No feature intersects this point");
      }

      //   **** Add all features to a set
      //   for (const feature of features) {
      //     featureSet.add(feature);
      //   }
      //   if (typeof window !== "undefined") {
      //     localStorage.setItem("mb_features", JSON.stringify(features));
      //   }

      for (const id of collapseFeatureIds) {
        mbMap.setFeatureState(
          {
            source: "composite",
            sourceLayer: "building",
            id: id,
          },
          {
            height: 0,
          }
        );
      }
      // **** Color features bases on their mapping ****
      for (const [feature, building] of Object.entries(mapping)) {
        mbMap.setFeatureState(
          {
            source: "composite",
            sourceLayer: "building",
            id: feature,
          },
          {
            shading: Math.max(1, building.properties["%_heatin_1"] * 10),
          }
        );
      }

      // **** Create Mapping between features and buildings ****
      //   const featureToBuildingMap = {};
      //   for (const feature of features) {
      //     for (const building of data) {
      //       const poly = _polygon(building.geometry.coordinates);
      //       const matches = _intersect(feature, poly);
      //       if (matches) {
      //         featureToBuildingMap[feature.id] = {
      //           _id: building._id,
      //           data: building.data,
      //           properties: building.properties,
      //         };
      //         mbMap.setFeatureState(
      //           {
      //             source: "composite",
      //             sourceLayer: "building",
      //             id: feature.id,
      //           },
      //           {
      //             shading: building.properties["%_heatin_1"] * 10,
      //           }
      //         );
      //       }
      //     }
      //   if (typeof window !== "undefined") {
      //     localStorage.setItem(
      //       "tecnico_ids",
      //       JSON.stringify(featureToBuildingMap)
      //     );
      //   }
      // }
    });

    // Trigger a resize to handle flex layout quirks.
    setTimeout(() => mbMap.resize(), 1);

    return () => {
      mbMap.remove();
      mapRef.current = null;
      onUnmount?.();
    };
    // Only use the props on mount. We don't want to update the map if they
    // change.
  }, []);

  // Handle Attribution
  useEffect(() => {
    if (!mapRef.current || !attributionPosition) return;

    const ctrl = new AttributionControl();
    mapRef.current.addControl(ctrl, attributionPosition);
    return () => {
      mapRef.current?.removeControl(ctrl);
    };
    /* mapRef is a ref */
  }, [attributionPosition]);

  //   useEffect(() => {
  //     if (!mapRef.current || !projection) return;
  //     // @ts-expect-error setProjection is missing on type
  //     mapRef.current.setProjection({ ...convertProjectionToMapbox(projection) });
  //   }, [mapRef, projection]);

  return (
    <>
      <div style={{ height: "100%" }} ref={containerRef} {...rest} />
    </>
  );
}

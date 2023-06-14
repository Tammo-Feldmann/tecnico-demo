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

import { globalVariables } from "../../../global-config";

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

  useEffect(() => {
    if (!containerRef.current) return;

    const mbMap = new MapboxMap({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.0066, 40.7135],
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

    onLoad && mbMap.once("load", onLoad);

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

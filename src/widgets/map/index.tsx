import { WidgetShell } from "@/components/widgets/widget-shell";
import type { WidgetRenderContext } from "@/lib/page-config/types";

export type MapWidgetProps = {
  embedUrl?: string;
  href?: string;
  label?: string;
  latitude?: number;
  longitude?: number;
  location: string;
  note?: string;
  title: string;
  zoom?: number;
};

export function MapWidget({ context, props }: { context?: WidgetRenderContext; props: MapWidgetProps }) {
  const title = props.title || "Map";
  const location = props.location || "Location";
  const compact = context?.variant === "compact";
  const coordinates = getCoordinates(props);
  const href = coordinates ? getOpenStreetMapHref(coordinates) : props.href;
  const renderTileMap = Boolean(coordinates);

  return (
    <WidgetShell
      ariaLabel={`${title}: ${location}`}
      background={{ type: "solid", value: "#F8FBF9" }}
      className="text-left"
      href={href}
      interactive
      showLinkIndicator={Boolean(href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <StaticMapPattern />
        {renderTileMap && coordinates ? <TileMap coordinates={coordinates} title={title} /> : null}
        {coordinates ? <MapMarker compact={compact} /> : null}
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${compact ? "h-14" : "h-20"} bg-[linear-gradient(180deg,transparent,rgba(248,250,252,0.48))]`} />
        <div className={`relative z-10 mt-auto ${compact ? "p-3" : "p-4"}`}>
          <div
            className={`inline-grid max-w-full rounded-[1.15rem] border border-white/80 bg-white/82 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-md ${
              compact ? "gap-0.5 px-2.5 py-2" : "gap-1 px-3.5 py-2.5"
            }`}
          >
            <h2 className={`truncate font-extrabold leading-none tracking-[-0.02em] text-[#141518] ${compact ? "text-[0.76rem]" : "text-[0.9rem]"}`}>{title}</h2>
            <p className={`truncate font-semibold leading-none text-[#141518]/58 ${compact ? "text-[0.58rem]" : "text-[0.7rem]"}`}>{location}</p>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

export const mapWidget = {
  type: "map",
  name: "地图",
  description: "Location card with optional OpenStreetMap or Google Maps embed.",
  editor: { inspector: "rich" },
  defaultLayout: { w: 2, h: 2, minW: 1, minH: 1, maxW: 4 },
  defaultProps: {
    title: "Tokyo",
    location: "Shibuya, Tokyo",
    label: "Location",
    note: "",
    latitude: 35.6595,
    longitude: 139.7005,
    zoom: 15,
    href: "https://www.openstreetmap.org/?mlat=35.6595&mlon=139.7005#map=15/35.6595/139.7005",
  } satisfies MapWidgetProps,
  Component: MapWidget,
};

function StaticMapPattern() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#F2F5F8]" data-map-backdrop="true">
      <div className="absolute left-[-12%] top-[24%] h-[16%] w-[122%] rotate-[-10deg] rounded-full bg-[#E3E9F0]" />
      <div className="absolute left-[32%] top-[-10%] h-[120%] w-[12%] rotate-[26deg] rounded-full bg-[#DFE7E5]" />
      <div className="absolute left-[6%] top-[60%] h-[7%] w-[94%] rotate-[12deg] rounded-full bg-white/85" />
    </div>
  );
}

function MapMarker({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`map-marker pointer-events-none absolute left-1/2 top-1/2 z-10 grid ${
        compact ? "size-6" : "size-8"
      } -translate-x-1/2 -translate-y-1/2 place-items-center`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#1479FF]/35"
        style={{ animation: "mgMapPulse 2.6s ease-out infinite" }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#1479FF]/25"
        style={{ animation: "mgMapPulse 2.6s ease-out 1.3s infinite" }}
      />
      <span
        className={`relative grid size-full place-items-center rounded-full border-2 border-white bg-[#1479FF] ${
          compact
            ? "shadow-[0_0_0_4px_rgba(20,121,255,0.18),0_10px_20px_rgba(20,121,255,0.32)]"
            : "shadow-[0_0_0_5px_rgba(20,121,255,0.18),0_14px_28px_rgba(20,121,255,0.36)]"
        }`}
      >
        <span className={`${compact ? "size-1.5" : "size-2"} rounded-full bg-white`} />
      </span>
    </div>
  );
}

type MapCoordinates = {
  latitude: number;
  longitude: number;
  zoom: number;
};

function getCoordinates(props: MapWidgetProps): MapCoordinates | undefined {
  if (!Number.isFinite(props.latitude) || !Number.isFinite(props.longitude)) {
    return undefined;
  }

  const latitude = clampNumber(Number(props.latitude), -85, 85);
  const longitude = clampNumber(Number(props.longitude), -180, 180);
  const zoom = clampNumber(Math.round(Number(props.zoom) || 15), 2, 18);

  return { latitude, longitude, zoom };
}

function getOpenStreetMapHref({ latitude, longitude, zoom }: MapCoordinates) {
  const lat = latitude.toFixed(4);
  const lon = longitude.toFixed(4);

  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}

function TileMap({ coordinates, title }: { coordinates: MapCoordinates; title: string }) {
  const tileSet = getMapTileSet(coordinates);

  return (
    <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
      <div
        className="absolute inset-[-32%] grid grid-cols-3 grid-rows-3 opacity-95 contrast-[1.04]"
        style={{ transform: `translate(${tileSet.offsetX}, ${tileSet.offsetY}) scale(1.08)` }}
      >
        {tileSet.tiles.map((tile, index) => (
          <img
            alt=""
            className="map-tile size-full object-cover"
            key={`${tile.x}-${tile.y}-${index}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            src={tile.src}
            title={`${title} map tile`}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_36%,rgba(255,255,255,0.12))]" />
    </div>
  );
}

function getMapTileSet({ latitude, longitude, zoom }: MapCoordinates) {
  const tileZoom = clampNumber(Math.min(zoom, 16), 2, 16);
  const maxIndex = 2 ** tileZoom;
  const center = getTileCoordinate(latitude, longitude, tileZoom);
  const originX = Math.floor(center.x) - 1;
  const originY = Math.floor(center.y) - 1;
  const xFraction = center.x - originX;
  const yFraction = center.y - originY;
  const offsetX = `${(1.5 - xFraction) * (100 / 3)}%`;
  const offsetY = `${(1.5 - yFraction) * (100 / 3)}%`;
  const tiles = [
    { x: originX, y: originY },
    { x: originX + 1, y: originY },
    { x: originX + 2, y: originY },
    { x: originX, y: originY + 1 },
    { x: originX + 1, y: originY + 1 },
    { x: originX + 2, y: originY + 1 },
    { x: originX, y: originY + 2 },
    { x: originX + 1, y: originY + 2 },
    { x: originX + 2, y: originY + 2 },
  ].map((tile) => {
    const x = ((tile.x % maxIndex) + maxIndex) % maxIndex;
    const y = clampNumber(tile.y, 0, maxIndex - 1);

    return {
      x,
      y,
      src: `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${tileZoom}/${y}/${x}`,
    };
  });

  return { offsetX, offsetY, tiles };
}

function getTileCoordinate(latitude: number, longitude: number, zoom: number) {
  const scale = 2 ** zoom;
  const latRadians = (latitude * Math.PI) / 180;
  const x = ((longitude + 180) / 360) * scale;
  const y = ((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2) * scale;

  return { x, y };
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

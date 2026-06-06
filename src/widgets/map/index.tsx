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
      href={!renderTileMap ? href : undefined}
      interactive={!renderTileMap}
      showLinkIndicator={!renderTileMap && Boolean(href)}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        {renderTileMap && coordinates ? (
          <TileMap coordinates={coordinates} title={title} />
        ) : (
          <StaticMapPattern />
        )}
        {coordinates ? <MapMarker compact={compact} /> : null}
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${compact ? "h-14" : "h-20"} bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.42))]`} />
        <div className={`relative z-10 mt-auto ${compact ? "p-3" : "p-4"}`}>
          <div className={`inline-grid max-w-full rounded-[1.15rem] border border-white/65 bg-white/72 shadow-[0_12px_30px_rgba(20,45,65,0.12)] backdrop-blur-[8px] ${compact ? "gap-0.5 px-2.5 py-2" : "gap-1 px-3.5 py-2"}`}>
            <h2 className={`truncate font-black leading-none text-[#151515] ${compact ? "text-[0.76rem]" : "text-[0.88rem]"}`}>{title}</h2>
            <p className={`truncate font-extrabold leading-none text-black/52 ${compact ? "text-[0.58rem]" : "text-[0.68rem]"}`}>{location}</p>
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
    <div className="absolute inset-0 bg-[#F5F8F4]">
      <div className="absolute left-[-10%] top-[24%] h-[18%] w-[118%] rotate-[-10deg] rounded-full bg-[#D7E4DC]" />
      <div className="absolute left-[30%] top-[-8%] h-[116%] w-[14%] rotate-[28deg] rounded-full bg-[#E2EAD8]" />
      <div className="absolute left-[8%] top-[58%] h-[9%] w-[92%] rotate-[13deg] rounded-full bg-white/80" />
    </div>
  );
}

function MapMarker({ compact }: { compact?: boolean }) {
  return (
    <div className={`map-marker pointer-events-none absolute left-1/2 top-1/2 z-10 grid ${compact ? "size-6 shadow-[0_0_0_6px_rgba(20,121,255,0.16),0_12px_24px_rgba(20,121,255,0.28)]" : "size-8 shadow-[0_0_0_8px_rgba(20,121,255,0.18),0_16px_34px_rgba(20,121,255,0.34)]"} -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1479FF]`}>
      <span className={`${compact ? "size-2" : "size-2.5"} rounded-full bg-white`} />
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
    <div className="absolute inset-0 bg-[#F6FAF6]">
      <div className="absolute inset-[-32%] grid grid-cols-3 grid-rows-3 opacity-95 saturate-[0.72] contrast-[1.08]" style={{ transform: `translate(${tileSet.offsetX}, ${tileSet.offsetY}) scale(1.08)` }}>
        {tileSet.tiles.map((tile) => (
          <img alt="" className="map-tile size-full object-cover" key={tile.src} loading="lazy" referrerPolicy="no-referrer" src={tile.src} title={`${title} map tile`} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_36%,rgba(255,255,255,0.1))]" />
    </div>
  );
}

function getMapTileSet({ latitude, longitude, zoom }: MapCoordinates) {
  const tileZoom = clampNumber(Math.min(zoom, 16), 2, 16);
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
  ].map((tile) => ({ ...tile, src: `https://a.basemaps.cartocdn.com/light_nolabels/${tileZoom}/${tile.x}/${tile.y}.png` }));

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

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Equipamento {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface Props {
  equipamentos: Equipamento[];
}

export function GridMap({ equipamentos }: Props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <MapContainer
        center={[-23.315, -46.740]}
        zoom={12}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {equipamentos.map((equipamento) => (
          <Marker
            key={equipamento.id}
            position={[
              equipamento.latitude,
              equipamento.longitude,
            ]}
          >
            <Popup>
              <strong>{equipamento.nome}</strong>
              <br />
              Status: {equipamento.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
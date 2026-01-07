// components/WorldMap.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Client } from '../types';
import './WorldMap.css';

// Corrigir ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface WorldMapProps {
  clients: Client[];
  selectedClient: Client | null;
  setSelectedClient: (client: Client) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ clients, selectedClient, setSelectedClient }) => {
  const clientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const testerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {clients.map(client => (
          <Marker
            key={client.id}
            position={[client.location.lat, client.location.lng]}
            icon={client.type === 'client' ? clientIcon : testerIcon}
            eventHandlers={{
              click: () => setSelectedClient(client),
            }}
          >
            <Popup>
              <div className="popup-content">
                <h4>{client.name}</h4>
                <p><strong>Tipo:</strong> {client.type === 'client' ? 'Cliente' : 'Tester'}</p>
                <p><strong>Local:</strong> {client.city}, {client.country}</p>
                {client.type === 'client' ? (
                  <p><strong>Indústria:</strong> {client.industry}</p>
                ) : (
                  <p><strong>Dispositivos:</strong> {client.devices?.join(', ')}</p>
                )}
                <button 
                  className="popup-btn"
                  onClick={() => setSelectedClient(client)}
                >
                  Ver Detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
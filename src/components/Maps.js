"use client";
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '900px',
};

const defaultCenter = {
  lat: 40,
  lng: -20,
};

export default function Map() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [newComment, setNewComment] = useState('');

  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        // Inicializar array de comentarios vacío si no existe
        const locationsWithComments = data.map(loc => ({
          ...loc,
          comments: [],
        }));
        setCities(locationsWithComments);
      } catch (err) {
        console.error('Error al obtener lugares:', err);
      }
    };

    fetchLocations();
  }, []);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    setCities((prevCities) =>
      prevCities.map((city) =>
        city._id === selectedCity._id
          ? { ...city, comments: [...(city.comments || []), newComment] }
          : city
      )
    );

    setNewComment('');
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={3}>
        {cities.map((city) => (
          <Marker
            key={city._id}
            position={{ lat: city.ubi_lat, lng: city.ubi_lng }}
            onClick={() => setSelectedCity(city)}
          />
        ))}

        {selectedCity && (
          <InfoWindow
            position={{ lat: selectedCity.ubi_lat, lng: selectedCity.ubi_lng }}
            onCloseClick={() => setSelectedCity(null)}
          >
            <div style={{ backgroundColor: 'white', padding: '10px', maxWidth: '200px' }}>
              <h3>{selectedCity.name}</h3>
              <p>{selectedCity.description}</p>
              <ul>
                {(selectedCity.comments || []).map((c, i) => (
                  <li key={i}>🗨️ {c}</li>
                ))}
              </ul>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario"
              />
              <button onClick={handleCommentSubmit}>Enviar</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

// PhotoList.js

import './PhotoList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PhotoList() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [viewerPhoto, setViewerPhoto] = useState(null);

  const fetchPhotos = async () => {
    const res = await axios.get('http://localhost:5000/photos');
    setPhotos(res.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleSelect = (id) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((pid) => pid !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const deleteSelected = async () => {
    if (window.confirm('Delete selected photos?')) {
      for (const id of selectedPhotos) {
        await axios.delete(`http://localhost:5000/photos/${id}`);
      }
      setSelectedPhotos([]);
      fetchPhotos();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {selectedPhotos.length > 0 && (
        <div
          style={{
            marginBottom: '15px',
            background: '#fff',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{selectedPhotos.length} selected</span>
          <button
            onClick={deleteSelected}
            style={{
              background: 'red',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '15px',
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo._id}
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <img
              src={photo.url}
              alt={photo.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => setViewerPhoto(photo)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <input
              type="checkbox"
              checked={selectedPhotos.includes(photo._id)}
              onChange={() => handleSelect(photo._id)}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '20px',
                height: '20px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                padding: '5px 10px',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              {photo.title}
            </div>
          </div>
        ))}
      </div>

      {viewerPhoto && (
        <div
          onClick={() => setViewerPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <img
            src={viewerPhoto.url}
            alt={viewerPhoto.title}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)',
            }}
          />
          <button
            onClick={() => setViewerPhoto(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
            }}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
}

export default PhotoList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Gallery({ refresh }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/photos');
        setPhotos(res.data);
      } catch (err) {
        console.error('❌ Fetch photos failed:', err);
      }
    };

    fetchPhotos();
  }, [refresh]);

  return (
    <div>
      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => (
          <img
            key={photo._id}
            src={`http://localhost:5000/${photo.path}`}
            alt=""
            style={{ width: '200px', margin: '10px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;

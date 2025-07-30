// App.js
import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import PhotoList from './components/PhotoList';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📸 My Local Google Photos</h1>
      <UploadForm onUpload={() => setRefresh(!refresh)} />
      <PhotoList key={refresh} />
    </div>
  );
}

export default App;

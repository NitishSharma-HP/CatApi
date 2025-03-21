import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [catImages, setCatImages] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const API_URL = 'https://api.thecatapi.com/v1/images/search';
  const API_KEY = 'live_kQVDMQ4BSRTPa49pLjErE63Hxyct83mFNmJq9mQZF3fGwVTF9KUfmIwpY0Cow3l5';

  const fetchBreeds = async () => {
    try {
      const res = await axios.get('https://api.thecatapi.com/v1/breeds', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      setBreeds(res.data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        page: page,
        api_key: API_KEY,
      };
      if (selectedBreed) {
        params.breed_ids = selectedBreed;
      }
      const res = await axios.get(API_URL, { params });
      setCatImages((prevImages) => [...prevImages, ...res.data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  }, [page, selectedBreed]);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    setCatImages([]);
    setPage(0);
    fetchImages();
  }, [selectedBreed, fetchImages]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchImages();
  };

  return (
    <div className="app">
      <h1>Cat Gallery</h1>
      <div className="breed-filter">
        <label htmlFor="breedSelect">Select a Breed: </label>
        <select
          id="breedSelect"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
      </div>
      <div className="gallery">
        {catImages.map((cat, index) => (
          <div key={index} className="card">
            <img src={cat.url} alt="Cat" />
          </div>
        ))}
      </div>
      <div className="load-more">
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
};

export default App;

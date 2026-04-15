import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputMovie, setInputMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to turn "[{'name': 'Action'}]" into "Action"
  const formatData = (raw) => {
    if (!raw) return "N/A";
    if (typeof raw !== 'string') return raw;
    try {
      // Cleans the common CSV format: [{id:.., name:..}]
      const parsed = JSON.parse(raw.replace(/'/g, '"'));
      return parsed.map(item => item.name).join(", ");
    } catch (e) {
      return raw; // Return as-is if it's not JSON
    }
  };

  const handleRecommend = async () => {
    if (!inputMovie) return;
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        movie: inputMovie
      });
      setRecommendations(response.data.recommendations);
      console.log("Received recommendations:", response.data.recommendations);
    } catch (err) {
      setError("No movies found. Try 'Avatar' or 'Action'.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="hero">
          <h1>Movie<span>Mind</span>.ai</h1>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search Title, Genre, or Keyword..." 
              value={inputMovie}
              onChange={(e) => setInputMovie(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
            />
            <button onClick={handleRecommend} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </header>

        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <div className="card-top">
                <span className="id-label">ID: {movie.id || movie.movie_id}</span>
                <span className="rating-label">⭐ {movie.vote_average || '0.0'}</span>
              </div>
              
              <div className="info">
                <h3>{movie.title}</h3>
                <p className="tagline"><i>{movie.tagline || "Original Motion Picture"}</i></p>
                
                <div className="meta-stats">
                  <div className="stat">
                    <span>Budget:</span> 
                    {Number(movie.budget) > 0 ? `$${(Number(movie.budget)/1000000).toFixed(1)}M` : '$0'}
                  </div>
                  <div className="stat">
                    <span>Revenue:</span> 
                    {Number(movie.revenue) > 0 ? `$${(Number(movie.revenue)/1000000).toFixed(1)}M` : '$0'}
                  </div>
                  <div className="stat"><span>Runtime:</span> {movie.runtime || '0'}m</div>
                  <div className="stat"><span>Pop:</span> {Math.round(movie.popularity) || 0}</div>
                </div>

                <div className="overview-box">
                   <strong>Overview:</strong>
                   <p>{movie.overview || "No description available."}</p>
                </div>

                {/* Uses our helper to clean the JSON genres */}
                <div className="genre-tags">
                   {formatData(movie.genres)}
                </div>
                
                <div className="card-footer">
                   <span>LANG: {movie.original_language?.toUpperCase()}</span>
                   <span>STATUS: {movie.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
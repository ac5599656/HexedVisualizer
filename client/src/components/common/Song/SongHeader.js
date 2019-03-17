import React from 'react';
import './Song.css';

const SongHeader = () => (
  <div className="song_header">
    <div className="song_container_header">
      <div className="song_text">
        <p>Song</p>
      </div>

      <div className="song_artist_text">
        <p>Artist</p>
      </div>

      <div className="song_album_text">
        <p>Album</p>
      </div>

      <div className="song_time_text">
        <p>Duration</p>
      </div>
    </div>
  </div>
);
export default SongHeader;

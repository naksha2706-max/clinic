import React from 'react';

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <h3>{video.title}</h3>
      <p>{video.description}</p>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="bg-white p-4 rounded shadow video-card input item">
      <h3 className="text-lg font-bold">{video.title}</h3>
      <p>{video.description}</p>
      <p>Difficulty: {video.difficulty}</p>
      <p>Tags: {video.tags.join(', ')}</p>
      <Link to={`/video/${video._id}`} className="text-blue-500">Watch Now</Link>
    </div>
  );
};

export default VideoCard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Video } from '../types';
import { Button, message } from 'antd';

interface VideoCardProps {
  video: Video;
  isWatchLaterPage? : boolean;
  setVideos?: (val: any) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isWatchLaterPage, setVideos }) => {

  useEffect(() => {
    const checkWatchLater = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await api.get('/api/watchlater');
        }
      } catch (err) {
        console.error('Error checking watch later:', err);
      }
    };
    checkWatchLater();
  }, [video._id]);

  const toggleWatchLater = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.warning('Please log in to use Watch Later');
        return;
      }
          await api.post(`/api/watchlater/${video._id}`);
    } catch (err) {
      console.error('Error toggling watch later:', err);
      alert('Failed to update Watch Later');
    }
  };

  const deleteWatchLater = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Please log in to use Watch Later');
      return;
    }
    await api.delete( `/api/watchlater/${video._id}`);
    setVideos && setVideos((prev: any ) => prev.filter((v: any) => v._id !== video._id));
  }

  return (
    <div className="bg-white p-4 rounded shadow video-card input item">
        <div>
       <iframe
        src={video.embedLink}
        title={video.title}
        className="w-full h-96 rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{maxWidth: '150px'}}
    
      ></iframe>
    </div>
      <h3 className="text-lg font-bold">{video.title}</h3>
      <p>{video.description}</p>
      <p>Difficulty: {video.difficulty}</p>
      <p>Tags: {video.tags.join(', ')}</p>
      <Link to={`/video/${video._id}`} className="text-blue-500">Watch Now</Link>
      <Button
          onClick={isWatchLaterPage ? deleteWatchLater : toggleWatchLater}
          className={`absolute top-2 right-2 p-2 rounded-full input ${
            isWatchLaterPage ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          } hover:bg-indigo-700 hover:text-white transition`}
          title={isWatchLaterPage ? 'Remove from Watch Later' : 'Add to Watch Later'}
        >
          {isWatchLaterPage? 'Remove' : 'Watch Later'}
        </Button>
    </div>
  );
};

export default VideoCard;
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Video } from '../types';
import { Button } from 'antd';

const AdminDashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/api/videos');
        setVideos(res.data.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVideos(videos.filter((video) => video._id !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 input">Admin Dashboard</h2>
      <div>
        {videos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
            <div className='video-container'>{
          videos.map((video) => (
            <div key={video._id} className="bg-white p-4 rounded shadow mb-4 video-card item">
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p>Creator: {video.creator.email}</p>
              <p>Views: {video.views}</p>
              <p>Likes: {video.likes}</p>
              <p>Dislikes: {video.dislikes}</p>
              <Button
                onClick={() => handleDelete(video._id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 input"
              >
                Delete
              </Button>
            </div>
          ))
        }
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
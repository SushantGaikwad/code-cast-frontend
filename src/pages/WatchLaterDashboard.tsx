import React, { useState, useEffect } from 'react';
import api from '../utils/api';

import { Video } from '../types';
import { Button, Input, Select } from 'antd';
import VideoCard from '../components/VideoCard';

interface FormState {
  title: string;
  description: string;
  embedLink: string;
  tags: string;
  difficulty: string;
  category: string;
}

const WatchLaterDashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    embedLink: '',
    tags: '',
    difficulty: '',
    category: '',
  });

  const {Option } = Select;

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await api.get('/api/watchlater');
      setVideos(res.data);
    };
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/api/videos', { ...form, tags: form.tags.split(',') }, {
        headers: {
            Authorization: localStorage.getItem('token'),
        }
    });
    setForm({ title: '', description: '', embedLink: '', tags: '', difficulty: '', category: '' });
    const res = await api.get('/api/videos/creator/');
    setVideos(res.data);
  };
  
  return (
    <div className="video-container">
    {videos.length === 0 ? (
      <p className="text-gray-500 input col-span-full text-center">No videos found.</p>
    ) : (
      videos.map((video) => <VideoCard key={video._id} video={video} isWatchLaterPage={true} setVideos={setVideos}/>)
    )}
  </div>
  );
};

export default WatchLaterDashboard;
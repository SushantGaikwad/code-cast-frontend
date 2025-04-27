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

const CreatorDashboard: React.FC = () => {
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
      const res = await api.get('/api/videos/creator');
      setVideos(res.data.videos);
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
    setVideos(res.data.videos);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/videos/${id}`);
    setVideos(videos.filter((video) => video._id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 input">Creator Dashboard</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded mb-2 input"
        />
        <Input.TextArea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded mb-2 input"
        />
        <Input
          type="text"
          placeholder="Embed Link (YouTube/Vimeo)"
          value={form.embedLink}
          onChange={(e) => setForm({ ...form, embedLink: e.target.value })}
          className="w-full p-2 border rounded mb-2 input"
        />
        <Input
          type="text"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full p-2 border rounded mb-2 input"
        />
        <Select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e })}
          className="w-full p-2 border rounded mb-2 input"
        >
          <Option value="">Select Difficulty</Option>
          <Option value="Beginner">Beginner</Option>
          <Option value="Intermediate">Intermediate</Option>
          <Option value="Advanced">Advanced</Option>
        </Select>
        <Input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded mb-2 input"
        />
        <Button htmlType="submit" className="bg-blue-500 text-white p-2 rounded input">Upload Video</Button>
      </form>
      <hr />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4r'>
        <span className='comment-header'>Uploaded Videos</span>
        <div className='video-container'>
        {videos.map((video) => (
          <div key={video._id} className="bg-white p-4 rounded shadow mb-4 input video-card grid grid-cols-1 md:grid-cols-3 gap-4 item">
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
            <p>Views: {video.views}</p>
            <p>Likes: {video.likes}</p>
            <p>Dislikes: {video.dislikes}</p>
            <p>Avg Watch Duration: {video.avgWatchDuration}s</p>
            <Button onClick={() => handleDelete(video._id)} className="bg-red-500 text-white p-2 rounded input">Delete</Button>
          </div>
        ))}
        </div> 
      </div>
    </div>
  );
};

export default CreatorDashboard;
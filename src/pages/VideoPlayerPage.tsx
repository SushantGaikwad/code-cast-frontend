import React, { useState, useEffect } from 'react';
import api from '../utils/api';

import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { Video, Comment } from '../types';
import { Button, Input, message } from 'antd';

const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/api/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error('Error fetching video:', err);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchVideo();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!video) return;
    try {
      await api.post(
        `/api/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setVideo({ ...video, likes: video.likes + 1 });
    } catch (err) {
      console.error('Error liking video:', err);
      message.error('Please login first like');
    }
  };

  const handleDislike = async () => {
    if (!video) return;
    try {
      await api.post(
        `/api/videos/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setVideo({ ...video, dislikes: video.dislikes + 1 });
    } catch (err) {
      console.error('Error disliking video:', err);
      message.error('Please login first dislike');
    }
  };

  const handleComment = async () => {
    try {
      await api.post(
        `/api/comments`,
        { video: id, content: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments([...comments, { _id: '', video: id, content: newComment, createdAt: new Date().toISOString() }]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      message.error('Please login first to comment');
    }
  };

  if (!video) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4 input">
      <VideoPlayer video={video} />
      <h2 className="text-2xl font-bold mt-4">{video.title}</h2>
      <p className="text-gray-600">{video.description}</p>
      <p className="text-sm">Difficulty: {video.difficulty}</p>
      <p className="text-sm">Tags: {video.tags.join(', ')}</p>
      <p className="text-sm">Creator: {video.creator.email}</p>
      <div className="flex gap-4 mt-4">
        <Button onClick={handleLike} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 input">
          Like ({video.likes})
        </Button>
        <Button onClick={handleDislike} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 input">
          Dislike ({video.dislikes})
        </Button>
      </div>
      <div className="mt-4">
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
        />
        <Button onClick={handleComment} className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 input">
          Submit
        </Button>
      </div>
      <div className="mt-4 comments">
        <span className='comment-header'>Comments: </span>
        {comments.map((comment) => (
          <p key={comment._id} className="border-b py-2 ">
            Anonymous: <span className='comment-context'>{comment.content}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayerPage;
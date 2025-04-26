import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';
import { Video } from '../types';
import { Input, message, Select } from 'antd';

interface Filters {
  tag: string;
  category: string;
  difficulty: string;
  search: string;
}

interface VideoResponse {
  videos: Video[];
  total: number;
  page: number;
  pages: number;
}

const VideoExplore: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filters, setFilters] = useState<Filters>({ tag: '', category: '', difficulty: '', search: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {Option} = Select;

  // Fetch unique categories and tags for filter dropdowns
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          api.get('/api/videos/categories'),
          api.get('/api/videos/tags'),
        ]);
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
        message.error('Unknown Error',)
      }
    };
    fetchFilters();
  }, []);

  // Fetch videos with pagination and filters
  const fetchVideos = useCallback(async (reset: boolean = false) => {
    try {
      const res = await api.get<VideoResponse>('/api/videos', {
        params: { ...filters, page: reset ? 1 : page, limit: 10 },
      });
      const { videos: newVideos, pages } = res.data;
      setVideos((prev) => (reset ? newVideos : [...prev, ...newVideos]));
      setHasMore(page < pages);
      if (reset) setPage(1);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  }, [filters, page]);

  // Initial fetch and filter changes
  useEffect(() => {
    fetchVideos(true);
  }, [filters]);

  // Load more videos for infinite scroll
  const loadMore = () => {
    setPage((prev) => prev + 1);
    fetchVideos();
  };

  // Debounced search
  const handleSearch = _.debounce((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 500);

  return (
    <div className="container py-8">
      <div className="sticky top-0 bg-gray-50 z-10 pb-6">
        <h2 className="text-3xl font-bold mb-4">Explore Videos</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by title..."
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 input"
          />
          <Select
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e })}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 input select-dropdown"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Select>
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e })}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 input select-dropdown"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e })}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 input select-dropdown"
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>
      </div>
      <InfiniteScroll
        dataLength={videos.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-4">Loading...</div>}
        endMessage={<p className="text-center py-4 text-gray-500 input">No more videos to load.</p>}
        scrollThreshold={1}
      >
        <div className="video-container">
          {videos.length === 0 ? (
            <p className="text-gray-500 input col-span-full text-center">No videos found.</p>
          ) : (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default VideoExplore;
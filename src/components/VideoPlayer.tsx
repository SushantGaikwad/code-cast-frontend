import React from 'react';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  return (
    <div className="w-full">
      <iframe
        src={video.embedLink}
        title={video.title}
        className="w-full h-96 rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {/* <iframe width="560" height="315" src={video.embedLink} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe> */}
    </div>
  );
};

export default VideoPlayer;
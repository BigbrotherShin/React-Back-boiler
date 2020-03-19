import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import moment from 'moment';

function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const videos = await Axios.get('/api/videos/getVideos');
      if (videos.data.success) {
        setSideVideos(videos.data.videos);
      } else {
        alert('비디오 데이터를 가져오지 못했습니다.');
      }
    };
    getData();
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          marginBottom: '1rem',
          padding: '0 2rem',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
          <a href={`/video/${video._id}`} style={{ position: 'relative' }}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='thumbnail'
            />
            <div className='duration'>
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <div style={{ width: '50%' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>{moment(video.createdAt).format('MMM Do YY')}</span>
            <br />
          </a>
        </div>
      </div>
    );
  });

  return (
    <div style={{ marginTop: '3rem' }}>{renderSideVideo}</div>

    // <div style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
    //   <div style={{ width: '40%', marginBottom: '1rem' }}>
    //     <a href>
    //       <img style={{ width: '100%' }} src alt />
    //     </a>
    //   </div>
    //   <div style={{ width: '50%' }}>
    //     <a href>
    //       <span style={{ fontSize: '1rem', color: 'black' }}>videoTitle</span>
    //       <br />
    //       <span>videoWriterName</span>
    //       <br />
    //       <span>videoViews</span>
    //       <br />
    //       <span>Time</span>
    //       <br />
    //     </a>
    //   </div>
    // </div>
  );
}

export default SideVideo;

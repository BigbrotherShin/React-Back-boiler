import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage({ match }) {
  const videoId = match.params.videoId; // Route hooks에서 제공하는 match props
  const variable = {
    videoId: videoId,
  };

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    Axios.post(
      '/api/videos/getVideoDetail',
      variable, // 서버에서 보내온 정보들
    ).then(res => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert('비디오 정보를 가져올 수 없습니다.');
      }
    });

    const getCommentData = async () => {
      const commentData = await Axios.post(
        '/api/comment/getComments',
        variable,
      );
      try {
        if (commentData.data.success) {
          // console.log('commentData.data: ', commentData.data);
          setComments(commentData.data.comments);
          console.log('commentData.data.comments: ', commentData.data.comments);
          // console.log('Comments: ', Comments);
        } else {
          alert('코멘트 데이터를 가져오지 못했습니다.');
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCommentData();
  }, []);

  const refreshFunction = newComment => {
    setComments(Comments.concat(newComment));
  };

  if (VideoDetail.writer) {
    const subscribeButton =
      VideoDetail.writer._id === localStorage.getItem('userId') ? (
        <div>본인입니다.</div>
      ) : (
        <Subscribe
          userTo={VideoDetail.writer._id}
          userFrom={localStorage.getItem('userId')}
        />
      );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            <List.Item
              actions={[
                <LikeDislikes
                  video
                  userId={localStorage.getItem('userId')}
                  videoId={videoId}
                />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>

            {/* Comments */}
            <Comment
              refreshFunction={refreshFunction}
              commentLists={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>loading..</div>;
  }
}

export default VideoDetailPage;

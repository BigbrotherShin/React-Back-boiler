import React, { useEffect, useState, createContext, useReducer } from 'react';
import Title from 'antd/lib/typography/Title';
import { Row, Col, Avatar } from 'antd';
import { Meta } from 'antd/lib/list/Item';
import Axios from 'axios';

import moment from 'moment';

// class LandingPage extends Component {
//   state = [];
//   componentDidMount() {
//     const fetchData = async () => {
//       const res = await Axios.get('/api/videos/getVideos');
//       if (res.data.success) {
//         console.log(res.data);
//         console.log(res.data.videos);
//         this.setState(res.data.videos);
//       } else {
//         alert('비디오 가져오기를 실패했습니다.');
//       }
//     };

//     fetchData();
//     console.log(this.state);
//   }

//   renderCards = this.state.map((video, index) => {
//     const minutes = Math.floor(video.duration / 60);
//     const seconds = Math.floor(video.duration - minutes * 60);
//     return (
//       <Col lg={6} md={8} xs={24} key={index}>
//         <a herf={`/videos/post/${video._id}`}>
//           <div style={{ position: 'relative' }}>
//             <img
//               style={{ width: '100%' }}
//               src={`http://localhost:5000/${video.thumnail}`}
//               alt='thumbnail'
//             />
//             <div className='duration'>
//               <span>
//                 {minutes} : {seconds}
//               </span>
//             </div>
//           </div>
//         </a>
//         <br />
//         <Meta
//           avatar={<Avatar src={video.writer.image} />}
//           title={video.title}
//           description=''
//         />
//         <span>{video.writer.name}</span>
//         <br />
//         <span style={{ marginLeft: '3rem' }}>{video.views} views</span> -{' '}
//         <span>{moment(video.createdAt).format('MMM Do YY')}</span>
//       </Col>
//     );
//   });

//   render() {
//     return (
//       <div style={{ width: '85%', margin: '3rem auto' }}>
//         <Title level={2}>Recommended</Title>
//         <hr />
//         <Row gutter={[32, 16]}>{this.renderCards}</Row>
//       </div>
//     );
//   }
// }

const RenderCards = ({ Videos }) =>
  Videos.map((video, index) => {
    const minutes = Math.floor(Number(video.duration) / 60);
    const seconds = Math.floor(Number(video.duration) - minutes * 60);
    console.log(video);

    return (
      <Col lg={6} md={8} xs={24} key={index + 'a'}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: 'relative' }}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='thumbnail'
            />
            <div className='duration'>
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=''
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: '3rem' }}>{video.views} views</span> -{' '}
        <span>{moment(video.createdAt).format('MMM Do YY')}</span>
      </Col>
    );
  });

function reducer(Videos, action) {
  switch (action.type) {
    case 'API_CALL': {
      // console.log('Action.payload: ', action.payload);
      // console.log('Videos :', [...Videos]);
      // console.log('Videos updated :', [...Videos, ...action.payload]);
      // console.log('Arrays: ', [['a', 'b']]);
      return (Videos = [...Videos, ...action.payload]);
    }
    default:
      return Videos;
  }
}

function Subscriptionpage() {
  // const [Videos, setVideos] = useState([]);
  let initialState = [];
  const [Videos, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // const fetchData = async () => {
    //   const res = await Axios.get('/api/videos/getVideos');
    //   if (res.data.success) {
    //     console.log([...res.data.videos]);
    //     setVideos([...res.data.videos]);
    //     // setVideos(['a', 'b']);
    //     console.log(Videos);
    //   } else {
    //     alert('비디오 가져오기를 실패했습니다.');
    //   }
    // };

    // fetchData();
    // console.log(Videos);
    const subscriptionVariables = {
      userFrom: localStorage.getItem('userId'),
    };

    const fetchData = async () => {
      const res = await Axios.post(
        '/api/videos/getSubscriptionVideos',
        subscriptionVariables,
      );
      if (res.data.success) {
        // console.log([...res.data.videos]);
        dispatch({ type: 'API_CALL', payload: res.data.subscriberVideos });
      } else {
        alert('비디오 가져오기를 실패했습니다.');
      }
    };
    fetchData();
    console.log(Videos);
  }, []);

  if (!Videos) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>
        <RenderCards Videos={Videos} />
      </Row>
    </div>
  );
}

export default Subscriptionpage;

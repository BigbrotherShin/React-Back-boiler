import React, { useState } from 'react';
import { Tooltip, Icon } from 'antd';
import { useEffect } from 'react';
import Axios from 'axios';

function LikeDislikes({ video, userId, videoId, commentId }) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);

  const [Dislikes, setDislikes] = useState(0);
  const [DislikeAction, setDislikeAction] = useState(null);

  const [Toggle, setToggle] = useState(false);

  let variable = {};
  if (video) {
    variable = { videoId, userId };
  } else {
    variable = { commentId, userId };
  }

  useEffect(() => {
    const getLikeData = async () => {
      await Axios.post('/api/like/getLikes', variable).then((res, err) => {
        if (res.data.success) {
          // 얼마나 많은 좋아요를 받았는지
          setLikes(res.data.likes.length);

          // 내가 그 좋아요를 눌렀는지
          res.data.likes.map(like => {
            if (like.userId === userId) {
              setLikeAction('liked');
            }
          });
        } else {
          alert('Load fail of likes information.');
        }
      });
    };

    const getDislikeData = async () => {
      await Axios.post('/api/like/getDislikes', variable).then((res, err) => {
        if (res.data.success) {
          // 얼마나 많은 싫어요를 받았는지
          setDislikes(res.data.dislikes.length);

          // 내가 그 싫어요를 눌렀는지
          res.data.dislikes.map(dislike => {
            if (dislike.userId === userId) {
              setDislikeAction('disliked');
            }
          });
        } else {
          alert('Load fail of dislikes information.');
        }
      });
    };

    getLikeData();
    getDislikeData();
  }, []);

  const onLike = async () => {
    try {
      setToggle(prevToggle => !prevToggle);
      // 만약 좋아요를 누르지 않은 상태라면
      if (!LikeAction) {
        // 싫어요도 누르지 않은 상태
        await Axios.post('/api/like/saveLike', variable).then((res, err) => {
          if (res.data.success) {
            setLikes(prevLikes => prevLikes + 1);
            setLikeAction('liked');
          } else {
            alert('좋아요 표시를 실패했습니다.');
            console.log(err);
          }
        });
        // 만약 싫어요를 누른 상태라면
        if (DislikeAction) {
          // 다음과 같은 명령은 서버에서 실행!!!!
          // await Axios.post('api/dislike/unDislike', variable).then(
          //   (res, err) => {
          //     if (res.data.success) {
          //       setDislikes(prevDislikes => prevDislikes - 1);
          //       setDislikeAction(null);
          //     } else {
          //       alert('싫어요 취소를 실패했습니다.');
          //       console.log(err);
          //     }
          //   },
          // );
          setDislikes(prevDislikes => prevDislikes - 1);
          setDislikeAction(null);
        }
      }
      if (LikeAction) {
        // 만약 좋아요를 누른 상태라면
        await Axios.post('/api/like/unLike', variable).then((res, err) => {
          if (res.data.success) {
            setLikes(prevLikes => prevLikes - 1);
            setLikeAction(null);
          } else {
            alert('좋아요 취소를 실패했습니다.');
            console.log(err);
          }
        });
      }
      setToggle(prevToggle => !prevToggle); // 중복 클릭을 방지하기 위해 Toggle을 다시 false로
    } catch (err) {
      console.error(err);
    }
  };

  const onDislike = async () => {
    try {
      setToggle(prevToggle => !prevToggle);
      // 만약 싫어요를 누르지 않은 상태라면
      if (!DislikeAction) {
        // 좋아요도 누르지 않은 상태
        await Axios.post('/api/like/saveDislike', variable).then((res, err) => {
          if (res.data.success) {
            setDislikes(prevDislikes => prevDislikes + 1);
            setDislikeAction('disliked');
          } else {
            alert('싫어요 표시를 실패했습니다.');
            console.log(err);
          }
        });
        // 만약 좋아요를 누른 상태라면
        if (LikeAction) {
          // 다음과 같은 명령은 서버에서 실행!!!!
          // await Axios.post('api/dislike/unDislike', variable).then(
          //   (res, err) => {
          //     if (res.data.success) {
          //       setDislikes(prevDislikes => prevDislikes - 1);
          //       setDislikeAction(null);
          //     } else {
          //       alert('싫어요 취소를 실패했습니다.');
          //       console.log(err);
          //     }
          //   },
          // );
          setLikes(prevLikes => prevLikes - 1);
          setLikeAction(null);
        }
      }
      if (DislikeAction) {
        // 만약 싫어요를 누른 상태라면
        await Axios.post('/api/like/unDislike', variable).then((res, err) => {
          if (res.data.success) {
            setDislikes(prevDislikes => prevDislikes - 1);
            setDislikeAction(null);
          } else {
            alert('싫어요 취소를 실패했습니다.');
            console.log(err);
          }
        });
      }
      setToggle(prevToggle => !prevToggle); // 중복 클릭을 방지하기 위해 Toggle을 다시 false로
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          <Icon
            type='like'
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={!Toggle ? onLike : undefined} // 중복클릭을 방지하기 위해 Toggle state 사용
          />
        </Tooltip>
      </span>
      <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>

      <span key='comment-basic-dislike'>
        <Tooltip title='Dislike'>
          <Icon
            type='dislike'
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={!Toggle ? onDislike : undefined} // 중복클릭을 방지하기 위해 Toggle state 사용
          />
        </Tooltip>
      </span>
      <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
    </div>
  );
}

export default LikeDislikes;

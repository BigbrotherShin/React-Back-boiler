import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment({ postId, commentLists, refreshFunction }) {
  const user = useSelector(state => state.user);
  const [commentValue, setCommentValue] = useState('');

  // useEffect(() => {
  //   console.log('Redux User: ', user);
  // }, []);b

  const onChange = event => {
    setCommentValue(event.target.value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: postId,
    };
    // console.log(variables);
    if (!user.userData.isAuth) {
      alert('로그인을 하셔야 합니다.');
    }
    const commentData = await Axios.post('/api/comment/saveComment', variables);
    try {
      if (commentData.data.success) {
        console.log(commentData.data.result);
        refreshFunction(commentData.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    } catch (e) {
      console.error(e);
    }

    setCommentValue('');
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <br />

      {/* comment list */}
      {commentLists &&
        commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment
                  refreshFunction={refreshFunction}
                  key={`${index}S`}
                  postId={postId}
                  comment={comment}
                />
                <ReplyComment
                  key={`${index}R`}
                  parentCommentId={comment._id}
                  refreshFunction={refreshFunction}
                  commentLists={commentLists}
                  postId={postId}
                />
              </>
            ),
        )}

      {/* Root Comment Form */}

      {user.userData.isAuth && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onChange}
            value={commentValue}
            placeholder='코멘트를 작성해주세요'
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            onSubmit
          </button>
        </form>
      )}
    </div>
  );
}

export default Comment;

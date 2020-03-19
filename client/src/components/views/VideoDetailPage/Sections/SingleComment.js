import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment({ postId, comment, refreshFunction }) {
  const user = useSelector(state => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [ReplyText, setReplyText] = useState('');

  const onOpenReply = () => {
    setOpenReply(prevOpenReply => !prevOpenReply);
  };
  const onChange = e => {
    setReplyText(e.target.value);
  };
  const onSubmit = async e => {
    e.preventDefault();
    if (!user.userData.isAuth) return;
    const variables = {
      content: ReplyText,
      writer: user.userData._id,
      postId: postId,
      responseTo: comment._id,
    };
    // console.log(variables);
    const commentData = await Axios.post('/api/comment/saveComment', variables);
    try {
      if (commentData.data.success) {
        console.log('commentData.data.result: ', commentData.data.result);
        refreshFunction(commentData.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    } catch (e) {
      console.error(e);
    }

    setReplyText('');
    setOpenReply(prevOpenReply => !prevOpenReply);
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem('userId')}
      commentId={comment._id}
    />,
    <span onClick={onOpenReply} key='comment-basic-reply-to'>
      Reply to
    </span>,
  ];

  return comment.writer ? (
    <div>
      <Comment
        actions={user.userData.isAuth ? actions : undefined}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.image} alt='avatar' />}
        content={comment.content}
      />
      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onChange}
            value={ReplyText}
            placeholder='코멘트를 작성해주세요'
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            onSubmit
          </button>
        </form>
      )}
    </div>
  ) : (
    alert('Wrong Request')
  );
}

export default SingleComment;

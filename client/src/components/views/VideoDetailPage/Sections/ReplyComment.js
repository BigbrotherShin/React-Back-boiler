import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment({
  commentLists,
  refreshFunction,
  postId,
  parentCommentId,
}) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    console.log('OpenReplyComments: ', OpenReplyComments);

    let commentNumber = 0;

    commentLists.map((comment, index) => {
      if (comment.responseTo === parentCommentId && comment.writer) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
  }, [commentLists /* OpenReplyComments */]);

  const renderReplyComment = parentCommentId => {
    return commentLists.map(
      (comment, index) =>
        comment.writer && (
          <>
            {comment.responseTo === parentCommentId && (
              <div style={{ width: '80%', marginLeft: '40px' }}>
                <SingleComment
                  refreshFunction={refreshFunction}
                  key={`${index}SS`}
                  postId={postId}
                  comment={comment}
                />
                <ReplyComment
                  key={`${index}RR`}
                  parentCommentId={comment._id}
                  refreshFunction={refreshFunction}
                  commentLists={commentLists}
                  postId={postId}
                />
              </div>
            )}
          </>
        ),
    );
  };

  const onHandleChange = () => {
    setOpenReplyComments(prevOpenReplyComments => !prevOpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{
            fontSize: '14px',
            margin: 0,
            color: 'gray',
            cursor: 'pointer',
          }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {OpenReplyComments ? renderReplyComment(parentCommentId) : undefined}
    </div>
  );
}

export default ReplyComment;

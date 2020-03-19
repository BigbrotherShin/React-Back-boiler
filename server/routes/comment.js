const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

//=================================
//             Comment
//=================================

router.post('/saveComment', async (req, res) => {
  const comment = new Comment(req.body);
  try {
    await comment.save();
    //   (err, comment) => {
    //   if (err) return res.json({ success: false, err });
    //   Comment.find({ _id: comment._id })
    //     .populate('writer')
    //     .exec((err, result) => {
    //       if (err) return res.json({ success: false, err });
    //       res.status(200).json({ success: true, result });
    //     });
    // }

    await Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  } catch (err) {
    console.error(err);
  }
});

router.post('/getComments', async (req, res) => {
  try {
    await Comment.find({ postId: req.body.videoId })
      .populate('writer')
      .exec((err, comments) => {
        if (err) res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, comments });
      });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

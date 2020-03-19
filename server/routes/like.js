const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================

router.post('/getLikes', async (req, res) => {
  try {
    let variable = {};

    if (req.body.videoId) {
      variable = { videoId: req.body.videoId };
    } else {
      variable = { commentId: req.body.commentId };
    }

    await Like.find(variable).exec((err, likes) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, likes });
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/getDislikes', async (req, res) => {
  try {
    let variable = {};

    if (req.body.videoId) {
      variable = { videoId: req.body.videoId };
    } else {
      variable = { commentId: req.body.commentId };
    }

    await Dislike.find(variable).exec((err, dislikes) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, dislikes });
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/saveLike', async (req, res) => {
  try {
    // const like = new Like(req.body);

    // await like.save((err, doc) => {
    //   if (err) return res.status(400).json({ success: false, err });
    //   res.status(200).json({ success: true, doc });
    // });

    // Lke collection에 클릭 정보를 넣어줌

    let variable = { userId: req.body.userId };

    if (req.body.videoId) {
      variable = { ...variable, videoId: req.body.videoId };
    } else {
      variable = { ...variable, commentId: req.body.commentId };
    }

    const like = new Like(req.body);

    await like.save(async (err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });

      // 만약 Dislike이 이미 클릭이 되어있다면, Dislike를 1 줄여준다.
      // 프론트가 아니라 여기 서버에서 Dislike를 줄여준다.
      await Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
      });
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/unLike', async (req, res) => {
  let variable = { userId: req.body.userId };

  if (req.body.videoId) {
    variable = { ...variable, videoId: req.body.videoId };
  } else {
    variable = { ...variable, commentId: req.body.commentId };
  }

  await Like.findOneAndDelete(variable).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc }); // Like collection 에서 가져온 document
  });
});

router.post('/saveDislike', async (req, res) => {
  try {
    let variable = { userId: req.body.userId };

    if (req.body.videoId) {
      variable = { ...variable, videoId: req.body.videoId };
    } else {
      variable = { ...variable, commentId: req.body.commentId };
    }

    const disLike = new Dislike(req.body);

    await disLike.save((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    });

    // 만약 Like이 이미 클릭이 되어있다면, Like를 1 줄여준다.
    // 프론트에서 따로 줄이는 것을 요청하지 말고, 한 번의 요청에 서버에서 처리
    await Like.findOneAndDelete(variable).exec((err, LikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/unDislike', async (req, res) => {
  // let variable = { userId: req.body.userId };

  // if (req.body.videoId) {
  //   variable = { ...variable, videoId: req.body.videoId };
  // } else {
  //   variable = { ...variable, commentId: req.body.commentId };
  // }

  let variable = { userId: req.body.userId };

  if (req.body.videoId) {
    variable = { ...variable, videoId: req.body.videoId };
  } else {
    variable = { ...variable, commentId: req.body.commentId };
  }

  await Dislike.findOneAndDelete(variable).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc }); // Dislike collection 에서 가져온 document
  });
});

module.exports = router;

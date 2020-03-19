const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');

const multer = require('multer');
let ffmpeg = require('fluent-ffmpeg');

// storage multer config
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('Only mp4 files are allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';

  // 비디오 러닝타임 가져오기
  ffmpeg.ffprobe(req.body.url, function(err, metadata) {
    console.log(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });
  // 썸네일 생성
  ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
      console.log(`'Will generate' ${filenames.join(', ')}`);
      console.log(filenames);

      filePath = `uploads/thumbnails/${filenames[0]}`;
    })
    .on('end', function() {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function(err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      filename: 'thumbnail-%b.png',
    });
});

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보들을 DB에 저장한다
  const video = new Video(req.body);
  // req.body = Axios.post('/api/videos/uploadVideo', variable)에서 variable에 담긴 정보
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.get('/getVideos', (req, res) => {
  // 비디오를 DB에서 가져와서 client에 보낸다
  Video.find() // video collection 안에 있는 모든 documents 가져옴
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post('/getSubscriptionVideos', async (req, res) => {
  // 자신의 아이디를 가지고 구독하는 사람들을 찾는다
  let subscribedUser = [];
  const subscriberInfo = await Subscriber.find({ userFrom: req.body.userFrom });
  try {
    subscriberInfo.map((subscriber, index) => {
      subscribedUser.push(subscriber.userTo);
    });
  } catch (err) {
    res.status(400).send(err);
  }
  await Video.find({
    writer: { $in: subscribedUser },
  })
    .populate('writer')
    .exec((err, subscriberVideos) => {
      if (err) res.status(400).send(err);
      res.status(200).json({ success: true, subscriberVideos });
    });
  // exec((err, subscriberInfo) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).json({ success: true, subscriberInfo });
  // subscriberInfo.map((subscriber, index) => {
  //   subscribedUser.push(subscriber.userTo);
  // });
  // });
  // 찾은 사람들의 비디오를 가지고 온다
  // Video.find({ writer: { $in: subscribedUser } })
  //   .populate('writer')
  //   .exec((err, videos) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).json({ success: true, videos });
  //   });
});

router.post('/getVideoDetail', async (req, res) => {
  // 비디오를 DB에서 가져와서 client에 보낸다
  await Video.findOne({ _id: req.body.videoId }) // video id로 가져옴
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

module.exports = router;

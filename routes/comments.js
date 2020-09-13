'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');

router.post(
  '/:scheduleId/users/:userId/comments',
  authenticationEnsurer,
  (req, res, next) => {
    const scheduleId = req.params.scheduleId;
    const userId = req.params.userId;
    const comment = req.body.comment;

    Comment.upsert({
      scheduleId: scheduleId,
      userId: userId,
      comment: comment.slice(0, 255)
    }).then(() => {
      res.json({ status: 'OK', comment: comment });
    });
  }
);

module.exports = router;
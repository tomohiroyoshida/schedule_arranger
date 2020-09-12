'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Schedule = require('../models/schedule');
const Candidate = require('../models/candidate');
const User = require('../models/user');


router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const scheduleId = uuid.v4();
  const updatedAt = new Date();
  Schedule.create({
    scheduleId: scheduleId,
    scheduleName: req.body.scheduleName.slice(0, 255) || '(名称未設定)',
    memo: req.body.memo,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((schedule) => {
    const candidateNames = req.body.candidates.trim().split('\n')
                          .map((s) => s.trim()).filter((s) => s !== "");
    const candidates = candidateNames.map((c) => { return {
      candidateName: c,
      scheduleId: schedule.scheduleId
    };})
    Candidate.bulkCreate(candidates).then(() => {
      res.redirect('/schedules/' + schedule.scheduleId);
    })
  });
});

router.get('/:scheduleId', authenticationEnsurer, (req, res, next) => {
  Schedule.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      scheduleId: req.params.scheduleId
    },
    order: [['updatedAt', 'DESC']]
  }).then((schedule) =>{
    if (schedule) {
      Candidate.findAll({
        where: { scheduleId: schedule.scheduleId },
        order: [['candidateId', 'ASC']]
      }).then((candidates) => {
        res.render('schedule', {
          user: req.user,
          schedule: schedule,
          candidates: candidates,
          users: [req.user]
        });
      });
    } else {
      const err = new Error('指定された予定は見つかりませんでした。');
      err.status = 404;
      next(err);
    }
  });
})

module.exports = router;
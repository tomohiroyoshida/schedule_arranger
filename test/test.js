'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');

describe('/login', () => {
	beforeAll(() => {
		passportStub.install(app);
		passportStub.login({ username: 'testuser '});
	});

	afterAll(() => {
		passportStub.logout();
		passportStub.uninstall(app);
	})
    
  test('ログインのためのリンクが含まれる', () => {
    return request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github"/)
      .expect(200);
	});
	test('ログイン時はユーザー名が表示される', () => {
		return request(app)
			.get('/login')
			.expect(/testuser/)
			.expect(200);
	});
})
describe('/logout', () => {
	test('redirect', () => {
		return request(app)
			.get('/logout')
			.expect('Location', '/')
			.expect(302)
	});
});

describe('/schedules', () => {
  beforeAll(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  afterAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  test('予定が作成でき、表示される', done => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .post('/schedules')
        .send({
          scheduleName: 'テスト予定1',
          memo: 'テストメモ1\r\nテストメモ2',
          candidates: 'テスト候補1\r\nテスト候補2\r\nテスト候補3'
        })
        .expect('Location', /schedules/)
        .expect(302)
        .end((err, res) => {
          const createdSchedulePath = res.headers.location;
          request(app)
            .get(createdSchedulePath)
						// TODO 作成された予定と候補が表示されていることをテストする
						.expect(/テスト予定1/)
            .expect(/テストメモ1/)
            .expect(/テストメモ2/)
            .expect(/テスト候補1/)
            .expect(/テスト候補2/)
            .expect(/テスト候補3/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              // テストで作成したデータを削除
              const scheduleId = createdSchedulePath.split('/schedules/')[1];
              Candidate.findAll({
                where: { scheduleId: scheduleId }
              }).then(candidates => {
                const promises = candidates.map(c => {
                  return c.destroy();
                });
                Promise.all(promises).then(() => {
                  Schedule.findByPk(scheduleId).then(s => {
                    s.destroy().then(() => {
                      if (err) return done(err);
                      done();
                    });
                  });
                });
              });
            });
        });
    });
  });
});
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
require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
    const fave = {
      name: 'hello',
      race: 'hybrid',
      img: 'http://www.placekitten.com/300/300',
      flavors: ['blue', 'grape', 'dry'],
      positive: ['happy', 'funny', 'cool'],
      negative: ['sad', 'dizzy'],
      medical: ['stress', 'insomnia'],
      description: 'hello there'
    };

    const myfave = {
      ...fave,
      owner_id: 2,
      id: 4,
    };

    test('gets data from strain api', async() => {
      const data = {
        'id': 37,
        'name': 'Alohaberry',
        'race': 'hybrid',
        'desc': 'Originating from the tropical islands of Hawaii, Alohaberry releases a pleasant aroma and taste of tropical berries. It is known for its unique sweet taste and because it is an equal hybrid, the effects are both mind and body. Flowering time for this plant is approximately 8-9 weeks.'
      };

      const test = await fakeRequest(app)
        .get('/name')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data).toEqual(test.body[0]);

    });
    test.only('make a new favorite', async() => {

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(fave)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(myfave);
    });

    test('return all favs for a given user', async() => {
      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(myfave);
    });

    test('deletes a favorite', async() => {
      const data = await fakeRequest(app)
        .delete('./api/favorite/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual([]);
      
    });

  });
});

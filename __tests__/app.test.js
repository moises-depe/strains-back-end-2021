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

    test('gets data from strain api', async () => {
      const data = {
        'id': 37,
        'name': 'Alohaberry',
        'race': 'hybrid',
        'desc': 'Originating from the tropical islands of Hawaii, Alohaberry releases a pleasant aroma and taste of tropical berries. It is known for its unique sweet taste and because it is an equal hybrid, the effects are both mind and body. Flowering time for this plant is approximately 8-9 weeks.'
      };



      const test = await fakeRequest(app)
        .get('/name?search=alohaberry')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data).toEqual(test.body[0]);

    });

    test('returns all entries from favorites', async () => {
      const faves = [
        {
          id: 1,
          owner_id: 1,
          name: 'cool train',
          race: 'hybrid',
          img: 'http://www.placekitten.com/300/300',
          flavors: ['earthy', 'pine'],
          positive: ['relaxed', 'happy', 'sleepy'],
          negative: ['dizzy'],
          medical: ['stress', 'insomnia', 'depression'],
          description: "Bakerstreet is a variety of Hindu Kush grown by Canadian LP Tweed. It is a pure indica with origins in the Hindu Kush mountain range. The subtle sweet and earthy sandalwood aroma of Bakerstreet induces a deep sense of calm that helps bring relief to those suffering pain, nausea, and stress disorders. Its heavy body effects make it a top strain to help you relax and unwind at the end of a long day. "

        },
        {
          id: 2,
          owner_id: 1,
          name: 'happy times',
          race: 'indica',
          img: 'http://www.placekitten.com/300/300',
          flavors: ['Spicy/Herbal', 'Pungent', 'Earthy'],
          positive: ['relaxed', 'happy', 'sleepy'],
          negative: ['dizzy', 'drymouth'],
          medical: ['stress', 'insomnia', 'depression'],
          description: 'Alaskan Ice by Green House Seeds is a powerful sativa that crosses a euphoric White Widow hybrid with the energizing buzz of Haze. Frostlike resin blankets the buds in a promise of soaring psychoactivity, anchored only by its moderate CBD content. The intensity of this 70% sativa strain is recommended for evening consumption and unproductive weekends. Alaskan Ice is a slight variant of Moby Dick, but poses a greater challenge to growers; cultivators with the expertise to raise Alaskan Ice will be rewarded with a highly potent harvest of sour, spicy buds following a 9 week flowering period. The high resin content of Alaskan Ice has made this strain a favorite among hash producers and patients with severe symptoms.'
        },
        {
          id: 3,
          owner_id: 1,
          name: 'african',
          race: 'sativa',
          img: 'http://www.placekitten.com/300/300',
          flavors: ['earthy', 'pine'],
          positive: ['relaxed', 'happy', 'sleepy'],
          negative: ['dizzy'],
          medical: ['stress', 'insomnia', 'depression'],
          description: 'African refers to the indigenous varieties of cannabis (or landraces) that grow natively in this region of the world. Because of this region\'s latitude and climate, these native landrace strains tend to be sativa in structure and effect. '
        }
      ];

      const data = await fakeRequest(app)
        .get('/checkfaves')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(faves);
    });

    test('returns all entries from favorites', async () => {
      const faves = [
        {
          id: 1,
          owner_id: 1,
          name: 'cool train',
          race: 'hybrid',
          img: 'http://www.placekitten.com/300/300',
          flavors: ['earthy', 'pine'],
          positive: ['relaxed', 'happy', 'sleepy'],
          negative: ['dizzy'],
          medical: ['stress', 'insomnia', 'depression'],
          description: "Bakerstreet is a variety of Hindu Kush grown by Canadian LP Tweed. It is a pure indica with origins in the Hindu Kush mountain range. The subtle sweet and earthy sandalwood aroma of Bakerstreet induces a deep sense of calm that helps bring relief to those suffering pain, nausea, and stress disorders. Its heavy body effects make it a top strain to help you relax and unwind at the end of a long day. "

        },
      ];

      const data = await fakeRequest(app)
        .get('/share/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(faves);
    });

    // test('make a new favorite', async () => {
    //   const fav = {
    //     name: 'hello',
    //     race: 'hybrid',
    //     img: 'http://www.placekitten.com/300/300',
    //     flavors: ['blue', 'grape', 'dry'],
    //     positive: ['happy', 'funny', 'cool'],
    //     negative: ['sad', 'dizzy'],
    //     medical: ['stress', 'insomnia'],
    //     description: 'hello there'
    //   };

    //   const data = await fakeRequest(app)
    //     .post('/api/favorites')
    //     .send(fav)
    //     .set('Authorization', token)
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body[0]).toEqual(myfave);
    // });

    // test('return all favs for a given user', async () => {
    //   const data = await fakeRequest(app)
    //     .get('/api/favorites')
    //     .set('Authorization', token)
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body[0]).toEqual(myfave);
    // });

    // test('deletes a favorite', async () => {
    //   const data = await fakeRequest(app)
    //     .delete('./api/favorite/4')
    //     .set('Authorization', token)
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual([]);

    // });

  });
});

import { expect } from 'chai';
import * as server from '../server/server';
import * as supertest from 'supertest';

const api = supertest(server);

describe('Hello World API', () => {

  describe('GET /hello/world', () => {

    let endpoint;

    beforeEach(() => {
      endpoint = api.get('/hello/world');
    });

    it('should include date', (done) => {
      endpoint.send()
        .expect(200)
        .expect((res) => {
          if (!/(\d{4})(-)(\d{2})(-)(\d{2})(T)(\d{2})(:)(\d{2}):(\d{2})/.test(res.text)) {
            throw new Error('Response does not contain a date');
          }
        })
        .end(done);
    });

  });

  describe('POST /hello/world', () => {

    let endpoint;

    beforeEach(() => {
      endpoint = api.post('/hello/world');
    });

    it('should include name param', (done) => {
      const name = 'coucou';
      endpoint
        .send({ name })
        .expect(200)
        .expect((res) => {
          if (res.text.search(name) === -1) {
            throw new Error('Body does not contain the name');
          }
        })
        .end(done);
    });

  });

});

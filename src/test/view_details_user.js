const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { jwtDecode } = require('jwt-decode');

chai.use(chaiHttp);
chai.should();

describe('Get User Details API', () => {
    let ACCESS_TOKEN;
    let userId;

    before(async () => {
        const res = await chai.request(app)
            .post('/api/user/sign-in')
            .send({
                email: 'testkhai@gmail.com',
                password: '123456'
            });

        ACCESS_TOKEN = res.body.access_token;
        const decoded = jwtDecode(res.body.access_token);
        userId = decoded.id;
    });

    it('should get details of the logged-in user', async () => {
        const userDetailsRes = await chai.request(app)
            .get(`/api/user/get-details/${userId}`)
            .set('token', `Bearer ${ACCESS_TOKEN}`);

        userDetailsRes.should.have.status(200);
        userDetailsRes.body.should.be.an('object');
        userDetailsRes.body.should.have.property('status').eql('OK');
        userDetailsRes.body.should.have.property('message').eql('Get Success');
        userDetailsRes.body.should.have.property('data');

        console.log('userDetailsRes', userDetailsRes._body)
 
    });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
chai.should();

describe('Create User API', () => {
    it('should create a new user', (done) => {
        chai.request(app)
        .post('/api/user/sign-up') // Sửa đổi địa chỉ URL
        .send({
            "email": "loan003@gmail.com",
            "password": "1234567",
            "confirmPassword": "1234567",
         })
        .end((err, res) => {
            if (err) {
                done(err); // Báo lỗi nếu có lỗi xảy ra
                return;
            }
            res.should.have.status(200); // Kiểm tra mã trạng thái phản hồi
            res.body.should.be.a('object'); // Kiểm tra kiểu dữ liệu của body
            res.body.should.have.property('status').eql('OK'); // Kiểm tra nội dung phản hồi
            res.body.should.have.property('message').eql('SUCCESS'); // Kiểm tra nội dung phản hồi
            console.log('res', res._body)
            done(); // Kết thúc kiểm tra
        });
    });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
chai.should();

describe('Create Product API', () => {
    it('should create a new product', async () => {
        // Dữ liệu của sản phẩm mới
        const newProduct = {
            name: 'Test Product11',
            image: 'D:\anhdep.webp',
            type: 'test',
            countInStock: 100,
            price: 100,
            rating: 4.5,
            discount: 4,
            description: 'This is a test product'
        };

        // Gửi yêu cầu tạo sản phẩm mới
        const createProductRes = await chai.request(app)
            .post('/api/product/create')
            .send(newProduct);

        // Kiểm tra phản hồi từ máy chủ
        createProductRes.should.have.status(200);
        createProductRes.body.should.be.an('object');
        createProductRes.body.should.have.property('status').eql('OK');
        createProductRes.body.should.have.property('message').eql('SUCCESS');
        createProductRes.body.should.have.property('data');

        // Kiểm tra thông tin của sản phẩm được tạo
        const createdProduct = createProductRes.body.data;
        // console.log('createdProduct', createdProduct)
    });
});

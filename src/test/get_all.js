const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
chai.should();

describe('Get All Products API', () => {
    it('should get all products', async () => {
        const getAllProductsRes = await chai.request(app)
            .get('/api/product/getAll')
            .query({ limit: 10, page: 0 }); // Bạn có thể thay đổi limit và page tùy thuộc vào yêu cầu của bạn

        // Kiểm tra phản hồi từ máy chủ
        getAllProductsRes.should.have.status(200);
        getAllProductsRes.body.should.be.an('object');
        getAllProductsRes.body.should.have.property('status').eql('OK');
        // getAllProductsRes.body.should.have.property('message').eql('getAll allObjectFilter Success');
        getAllProductsRes.body.should.have.property('data');
        getAllProductsRes.body.should.have.property('total');
        getAllProductsRes.body.should.have.property('pageCurrent');
        getAllProductsRes.body.should.have.property('totalPage');

        // Lấy dữ liệu sản phẩm từ phản hồi
        const products = getAllProductsRes.body.data;
        // in ra console để kiểm tra dữ liệu nhận về
        console.log('products', products)
    });
});

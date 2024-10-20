const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const CommentRouter = require('./CommentRouter')
const PaymentRouter = require('./PaymentRouter')
const SliderRouter = require('./SliderRouter')

// const jwt = require('jsonwebtoken')

// nơi chứa tất cả route của api
const routes = (app) => {
    // sau khi được gọi bởi index.js bên ngoài thì sau đó sẽ link đến trang UserRouter.js
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/comment', CommentRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/slider', SliderRouter)



// // Đăng nhập và lấy token
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;
//     // Thực hiện kiểm tra người dùng (ở đây là ví dụ đơn giản)
//     if (username === 'user' && password === 'password') {
//       const user = { name: username };
//       const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
//       res.json({ token });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });

// // JWT Middleware
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       next();
//     });
//   }

//     // API lấy cấu hình giao diện
// app.get('/api/config', authenticateToken, (req, res) => {
//     // Đây là ví dụ cấu hình giao diện
//     const config = {
//       theme: {
//         primaryColor: '#ff5722',
//         secondaryColor: '#4caf50',
//       },
//       features: {
//         newFeatureEnabled: true,
//         betaFeatureEnabled: false,
//       },
//       texts: {
//         welcomeMessage: 'Welcome to our app11!',
//         contactSupport: 'Contact support at support@yourwebsite.com',
//       },
//     };
//     res.json(config);
//   });
  
//   // API lấy script logic (nếu sử dụng cách này)
//   app.get('/api/script', authenticateToken, (req, res) => {
//     // Ví dụ trả về mã JavaScript
//     const script = `
//       function showMessage() {
//         console.log("Button was clicked from server logic");
//       }
//     `;
//     res.type('.js').send(script);
//   });

//   // Bảo vệ API với HMAC (Tùy chọn)
// app.post('/api/secure-endpoint', (req, res) => {
//     const signature = req.headers['x-hmac-signature'];
//     const message = JSON.stringify(req.body);
//     const secret = 'your_hmac_secret_key';
  
//     const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
  
//     if (hash !== signature) {
//       return res.status(403).json({ message: 'Invalid signature' });
//     }
  
//     // Xử lý yêu cầu hợp lệ
//     res.json({ message: 'Secure data accessed' });
//   });


}

module.exports = routes

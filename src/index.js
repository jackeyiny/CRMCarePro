const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Chat = require("./models/ChatModel");

const requestIp = require('request-ip');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Tạo HTTP Server cho cả Express và WebSocket
const server = http.createServer(app);

// Cấu hình CORS cho Socket.io
const io = new Server(server, {
    cors: {
        origin: [process.env.HOST, process.env.LOCAL], // Thay đổi thành domain của bạn nếu cần
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});
// lấy địa chỉ ip
app.use(requestIp.mw()); // Middleware để lấy IP từ yêu cầu

// Middleware
app.use(cors({
    origin: [process.env.HOST, process.env.LOCAL], // Thay đổi thành domain của bạn nếu cần
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

// Route điều hướng
routes(app);

// Serve CKEditor static files
app.use(
    "/ckeditor",
    express.static(__dirname + "/node_modules/@ckeditor/ckeditor5-build-classic/build")
);

// Lưu trữ socket.id của từng user
let users = {};
// WebSocket xử lý sự kiện
let firstUserId = '';
let secondUserId = '';
io.on("connection", (socket) => {
    let usersName = '';
    // Lưu socket.id của user và kết nối với username (hoặc id user, nếu cần)
    socket.on('register', (username) => {
        users[username] = socket.id;
        usersName = username
    });

    
    // Lưu socket.id của user khi gửi tin 
    socket.on('registeridUser', (idUserAdmin) => {
        const [firstUserId1, secondUserId2] = idUserAdmin.split('-');
        firstUserId = firstUserId1;
        secondUserId = secondUserId2;
    });

    socket.on('DkIdUser', (userId, name) => {
        users[userId] = socket.id; // Lưu chính xác socket.id
        const loichao = `Chào mừng bạn trở lại, ${name}`;
        io.to(users[userId]).emit('LoiChao', loichao);
    });

    // gửi tin phía user
    socket.on('sendMessage', async (messageData) => {
        try {
            const { conversationId, senderId, senderName, isAdmin, senderImage, messageContent } = messageData;
            const newMessage = new Chat({
                conversationId,
                senderId,
                senderName,
                senderImage,
                isAdmin,
                messageContent,
                status: 'unread',
            });
            const result = await newMessage.save();
            const firstUserSocket = users[firstUserId];
            const secondUserSocket = users[secondUserId];
            io.emit('newMessage1', result);
            if (firstUserSocket) {
                // io.to(firstUserSocket).emit('newMessage1', result);
            } else {
                console.log(`User ${firstUserId} is not connected yet.`);
            }
            if (secondUserSocket) {
                // io.to(secondUserSocket).emit('newMessage1', result);
            } else {
                console.log(`User ${secondUserId} is not connected yet.`);
            }

        } catch (e) {
            // reject(e);
        }
    });

    // loard tin phía user
    socket.on('GetMessagesDetail', async (conversationId) => {
        // Tìm socket.id của người nhận và gửi tin nhắn cho họ
        const recipientSocketId = users[usersName]; // messageData.to là username của người nhận
        if (recipientSocketId) {
            try {
                const DL_Tin_Nhan = await Chat.find({ conversationId }).sort({ createdAt: 1 });
                io.to(recipientSocketId).emit('DL_Tin_Nhan', DL_Tin_Nhan);
            } catch (e) {
                reject(e);
            }
        } else {
            console.log('Recipient not connected');
        }

        
    });

    // lấy danh sách tin nhắn user
    socket.on('layDL', async () => {
        // Tìm socket.id của người nhận và gửi tin nhắn cho họ
        const recipientSocketId = users[usersName]; // messageData.to là username của người nhận
        if (recipientSocketId) {
            try {
                const conversations = await Chat.aggregate([
                    { $match: { isAdmin: false } }, // Lọc tin nhắn từ user gửi đến admin
                    {
                        $group: {
                            _id: '$conversationId',
                            lastMessage: { $last: '$messageContent' },
                            lastMessageAt: { $last: '$createdAt' },
                            senderId: { $first: '$senderId' },
                            senderName: { $first: '$senderName' },
                            senderImage: { $first: '$senderImage' },
                            status: { $last: '$status' },
                        },
                    },
                    { $sort: { lastMessageAt: -1 } }, // Sắp xếp theo thời gian tin nhắn mới nhất
                ]);
                io.to(recipientSocketId).emit('DS_user', conversations);
            } catch (e) {
                reject(e);
            }
        } else {
            console.log('Recipient not connected');
        }

        
    });

    // dữ liệu message bên phía admin
    socket.on('DL_idUser_idAdmin', async (senderId, conversationId) => {
        // Tìm socket.id của người nhận và gửi tin nhắn cho họ
        const recipientSocketId = users[usersName]; // messageData.to là username của người nhận
        if (recipientSocketId) {
            try {
                if (!conversationId.includes('-')) {
                    throw new Error('Invalid conversation ID format');
                }
                const [firstId, secondId] = conversationId.split('-');
                const recipientId = (senderId === firstId) ? secondId : firstId;
                const DL_detail_message = await Chat.find({
                    conversationId: {
                        $in: [
                            `${firstId}-${secondId}`,
                            `${secondId}-${firstId}`
                        ]
                    },

                }).sort({ createdAt: 1 }); // Sắp xếp tin nhắn từ cũ tới mới

                io.to(recipientSocketId).emit('DL_detail_message', DL_detail_message);

            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        } else {
            console.log('Recipient not connected');
        }

       
    });

    // socket.on('disconnect', () => {
    //     if (userId) {
    //         delete users[userId]; // Xóa user khỏi danh sách khi ngắt kết nối
    //         console.log(`User disconnected: ${userId}`);
    //     }
    // });
});

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log("Connect MongoDB success!");

        // Lắng nghe HTTP và WebSocket trên cùng một cổng
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Export cho test
module.exports = app;

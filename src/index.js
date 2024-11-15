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
io.on("connection", (socket) => {
    let usersName = '';
    // Lưu socket.id của user và kết nối với username (hoặc id user, nếu cần)
    socket.on('register', (username) => {
        users[username] = socket.id;
        usersName = username
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
            io.emit('newMessage', result);

        } catch (e) {
            reject(e);
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

        // Khi client ngắt kết nối
        socket.on('disconnect', () => {
            // Tìm và xóa user khi họ ngắt kết nối
            for (let username in users) {
                if (users[username] === socket.id) {
                    delete users[username];
                    break;
                }
            }
        });
    });

    // lấy danh sách tin nhắn user
    socket.on('layDL', async () => {
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
            io.emit('DS_user', conversations);
        } catch (e) {
            reject(e);
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

        // Khi client ngắt kết nối
        socket.on('disconnect', () => {
            // Tìm và xóa user khi họ ngắt kết nối
            for (let username in users) {
                if (users[username] === socket.id) {
                    delete users[username];
                    break;
                }
            }
        });
    });
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

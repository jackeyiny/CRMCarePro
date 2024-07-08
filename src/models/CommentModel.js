// const mysql = require('mysql');

// const db = mysql.createConnection({
//     host: "database-1.czwyys20ydp1.ap-southeast-2.rds.amazonaws.com",
//     port: "3306",
//     user: "admin",
//     password: "Khai123123",
//     database: "my_db"
// });

// db.connect(err => {
//     if(err) {
//         console.log(err.message);
//         return;
//     }
//     console.log("Connect Mysql success!");
//     // Tạo bảng comments khi kết nối thành công
//     Comment.createTable();
    
// });

// const Comment = {
//     // Phương thức để tạo bảng comments trong cơ sở dữ liệu
//     createTable: () => {
//         const createTableQuery = `
//         CREATE TABLE IF NOT EXISTS comments (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             id_user VARCHAR(255) NOT NULL,
//             id_product VARCHAR(255) NOT NULL,
//             user_comments TEXT NOT NULL,
//             image_comments LONGTEXT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         )
//         `;
//         db.query(createTableQuery, (err, results, fields) => {
//         if (err) {
//             console.error('Error creating table:', err);
//             return;
//         }
//         if (results.warningStatus === 0) {
//             console.log('Table "comments" already exists');
//         } else {
//             // console.log('Table "comments" created successfully');
//         }
//         });
//     },

//     dropTable: () => {
//         const dropTableQuery = `
//         DROP TABLE IF EXISTS comments
//         `;
//         db.query(dropTableQuery, (err, results, fields) => {
//             if (err) {
//                 console.error('Error dropping table:', err);
//                 return;
//             }
//             if (results.warningStatus === 0) {
//                 console.log('Table "comments" dropped successfully');
//             } else {
//                 console.log('Table "comments" does not exist');
//             }
//         });
//     },
    
  
//     // Phương thức để thêm một bình luận mới vào cơ sở dữ liệu
//     createComment: (commentData) => {
//         return new Promise((resolve, reject) => {
//             const insertQuery = 'INSERT INTO comments SET ?';
//             // console.log('insertQuery', insertQuery)
//             db.query(insertQuery, commentData, (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results.insertId);
//                 }
//             });
//         });
//     },

//     // Phương thức để lấy thông tin của một bình luận từ cơ sở dữ liệu theo ID
//     getCommentById: (id_product) => {
//         return new Promise((resolve, reject) => {
//             const selectQuery = 'SELECT * FROM comments WHERE id_product = ?';
//             db.query(selectQuery, [id_product], (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });
//     },
    

//     // Phương thức để cập nhật thông tin của một bình luận trong cơ sở dữ liệu
//     updateComment: (commentId, commentData) => {
//         return new Promise((resolve, reject) => {
//             const updateQuery = 'UPDATE comments SET ? WHERE id = ?';
//             db.query(updateQuery, [commentData, commentId], (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results.changedRows);
//                 }
//             });
//         });
//     },
    

//     // Phương thức để xóa một bình luận khỏi cơ sở dữ liệu
//     deleteComment: (commentId) => {
//         return new Promise((resolve, reject) => {
//             const deleteQuery = 'DELETE FROM comments WHERE id = ?';
//             db.query(deleteQuery, [commentId], (err, results) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(results.affectedRows);
//                 }
//             });
//         });
//     }
    
// };

// module.exports = Comment;

const mongoose = require('mongoose');

// Định nghĩa Schema cho collection 'comments'
const commentSchema = new mongoose.Schema(
    {
        // Tên người bình luận
        name: { type: String, required: true },
        // ID của người dùng
        id_user: { type: String, required: true },
        // ID của sản phẩm được bình luận
        id_product: { type: String, required: true },
        // Nội dung bình luận
        user_comments: { type: String, required: true },
        // Ảnh bình luận (có thể là URL hoặc dữ liệu hình ảnh nếu cần)
        image_comments: { type: String },
    },
    {
        timestamps: true, // Tự động thêm trường created_at và updated_at
    }
);

// Tạo model từ Schema đã định nghĩa
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

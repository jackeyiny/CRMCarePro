// models/AdminResponse.js
const mongoose = require('mongoose');

const adminResponseSchema = new mongoose.Schema(
    {
        customerRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomerRequest',
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        response: {
            type: String,
            required: true,
        },
        paymentRequested: {
            type: Boolean,
            default: false,
        },
        paymentConfirmed: {
            type: Boolean,
            default: false,
        },
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const AdminResponse = mongoose.model('AdminResponse', adminResponseSchema);
module.exports = AdminResponse;

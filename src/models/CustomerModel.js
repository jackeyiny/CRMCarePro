const mongoose = require('mongoose');
const User = require('./UserModel');  // Import model User để sử dụng trong schema

const customerRequestSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // Liên kết với bảng User
            required: true 
        },
        message: { type: String, required: true },
        responsetoAdmin: { type: String },
        requestType: { 
            type: String, 
            enum: ['Quote Request', 'Complaint', 'Feedback'], 
            required: true 
        },
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', // Chỉ áp dụng cho Quote Request, liên kết với bảng Product
            required: function() { return this.requestType === 'Quote Request'; } 
        },
        notify: {
            type: Boolean,
            default: false,
        },
        paymentRequested: {
            type: Boolean,
            default: false,
        },
        paymentConfirmed: {
            type: Boolean,
            default: false,
        },
        status: { 
            type: String, 
            enum: ['Unprocessed', 'Processed'], 
            default: 'Unprocessed' 
        },
        adminResponse: { 
            type: String, 
            required: function() { return this.requestType === 'Complaint'; } 
        },
    },
    { timestamps: true }
);

const CustomerRequest = mongoose.model("CustomerRequest", customerRequestSchema);

module.exports = CustomerRequest;

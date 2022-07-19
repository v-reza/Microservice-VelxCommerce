const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
    {
        transaction_time: {
            type: String,
            required: true
        },
        transaction_status: {
            type: String,
            required: true
        },
        transaction_id: {
            type: String,
            required:true
        },
        status_message: {
            type: String,
            required: true
        },
        status_code: {
            type: Number,
            required: true
        },
        signature_key: {
            type: String,
        },
        payment_type: {
            type: String,
            required: true
        },
        order_id: {
            type: String,
            required: true
        },
        gross_amount: {
            type: String,
            required: true
        },
        fraud_status: {
            type: String,
        },
        currency: {
            type: String,
            required: true,
            default: "IDR"
        },
        cart_id: {
            type: Array,
            default: []
        },
        user_id: {
            type: String,
            required: true
        },
        pdf_url: {
            type: String,
        }
    },
    {timestamps: true}
)


module.exports = mongoose.model("Transaction", TransactionSchema)
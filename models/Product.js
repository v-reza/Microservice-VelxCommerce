const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true
        },
        product_desc: {
            type: String,
            max: 50
        },
        product_image: {
            type: String,
            default: ""
        },
        product_price: {
            type: String,
            required: true
        },
        product_category: {
            type: String,
            required: true,
        },
        product_views: {
            type: Number,
            default: 1
        },
        product_stock: {
            type: Number
        },
        product_buying: {
            type: Number,
            default: 0
        },
        product_color: {
            type: Array,
            default: []
        },
        product_size: {
            type: Array,
            default: []
        },
        product_list_image: {
            type: Array,
            default: []
        },
    },
    {timestamps: true}
)


module.exports = mongoose.model("Product", ProductSchema)
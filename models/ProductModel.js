const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    ProductName: String,
    Category: String,
    Price : Number,
    Description : String,
    Picture : String
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = {
    ProductModel,
    ProductSchema
}
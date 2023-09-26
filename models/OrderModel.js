const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Product = require('./ProductModel');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    UserId : String,
    Products : Object,
    Address: String,
    City: String,
    Country: String,
    Zip: String,
    Price: Number,
    Date : Date,
    Status: String
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports= {
    OrderModel,
    OrderSchema
}
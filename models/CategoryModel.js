const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    CategoryName: String,
    Description : String,
    Image: String,
});

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = {
    CategoryModel,
    CategorySchema
}
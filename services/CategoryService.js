const Category = require('../models/CategoryModel').CategoryModel;
const productServices = require('../services/ProductService');

const getCategoryByName = async (name) => {
    return await Category.findOne({CategoryName : name});
};
const getAllCategories = async () => {
    return await Category.find({}).lean();
};

// ------------------------ ONLY FOR ADMINS!!--------------------------------
const getCategoryById = async (id) => {
    return await Category.findById(id);
};
const createCategory = async (name, desc, image) => {
    const category = new Category({
        CategoryName : name,
        Description : desc,
        Image : image
    });
    return await Category.insertMany(category);
};
const deleteCategory = async (id) => {
    const category = await getCategoryById(id);
    if (!category)
        return null;
    
    return await Category.findByIdAndRemove(id);
};

module.exports = {
    getCategoryByName,
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
}
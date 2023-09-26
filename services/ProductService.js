const Product = require('../models/ProductModel').ProductModel;

const getProductByName = async (productName) => {
    return await Product.findOne({productName : productName});
};
const getProductByPriceMax = async (price) => {
    return await Product.findOne({Price : {$ls : price}});
};
const getAllProducts = async () => {
    return await Product.find({}).lean();
};
// ------------------------ ONLY FOR ADMINS!!--------------------------------
const getProductById = async (id) => {
    return await Product.findById(id);
};

const getProductByCategoryId = async (id) => {
    return await Product.find({Category: id});
};
const createProduct = async (productName, category, description, price, picture) => {
    const product = new Product({
        ProductName : productName,
        Category : category,
        Price : price,
        Description : description,
        Picture : picture
    });
    return await Product.insertMany(product);
};
const updateProduct = async (id, productName, price, description ,picture) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    product.ProductName = productName;
    product.Price = price;
    product.Picture = picture;
    product.Description = description;
    return await Product.updateMany({_id:id}, {$set:{ProductName: productName,Price: price, Description: description,Picture: picture}});
};
const deleteProduct = async (id) => {
    const product = await getProductById(id);
    if (!product)
        return null;
    return await Product.findByIdAndRemove(id);
};

module.exports = {
    createProduct,
    getProductById,
    getProductByName,
    getProductByPriceMax,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductByCategoryId
}
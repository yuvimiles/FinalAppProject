const productService = require('../services/ProductService')


async function getAllProducts(req,res){
products = await productService.getAllProducts();
res.send({products:products});
}
async function getTop5Prod(req,res){
    products = await productService.getTop5ProductsByNumberOfOrders();
    res.send({products:products});
}
async function editProduct(req, res) {
    const { productId, productName, productDescription, productPrice } = req.body;
    const updatedData = {
        name: productName,
        description: productDescription,
        price: productPrice
    };
    if (req.file) {
        updatedData.image = req.file.path;
    }
    await ProductModel.findByIdAndUpdate(productId, updatedData);
    res.redirect('/admin/products');
}

async function deleteProduct(req, res) {
    const { productId } = req.params;
    await ProductModel.findByIdAndDelete(productId);
    res.redirect('/admin/products');
}

module.exports = {
getAllProducts,
getTop5Prod,
editProduct,
deleteProduct
}


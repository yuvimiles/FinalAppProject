const CustomerService = require('../services/CustomerService');
const UserService = require('../services/UserService');
const productService = require('../services/ProductService');
const categoryService = require('../services/CategoryService');
const orderService = require('../services/OrderService');
const ObjectId = require('mongodb').ObjectId;


async function cAndcRender(req,res){
    products = await productService.getAllProducts();
    const userLoggedIn = req.session.UserID != null;
    let isAdmin = false != null;
    if (userLoggedIn == true){
      const User = await UserService.getUserById(req.session.UserID);
      if(User.isAdmin == true){
        isAdmin = true  
      }
    }
    const categories = await categoryService.getAllCategories();
    res.render('home', { userLoggedIn,isAdmin, categories });
}
async function renderAdminPage(req,res){
   // --------------await operations-------------------
   const User = await UserService.getUserById(req.session.UserID);
    if(User == null){
        cAndcRender(req,res,null);        
    }
    else if(!User.isAdmin){
        Cust = await CustomerService.getCustomerById(User.id);
        cAndcRender(req,res);
    }
    else{
        const User = await UserService.getUserById(req.session.UserID);
        const users = await UserService.getAllUsers();
        const orders = await orderService.getAllOrders();
        const products = await productService.getAllProducts();
        const categories = await categoryService.getAllCategories();
        const fiveWeeksSum = await orderService.aggregateLast5Weeks();
        res.render("admin",{User,users,orders, products, categories, fiveWeeksSum});
    } 
    
} 

async function logout(req,res){
    req.session.destroy();
    url = "/";
    res.redirect(url);
     
 }

async function getLists(req,res){
    const productList = await productService.getAllProducts();
    const customerList = await CustomerService.getAllCustomers();
    const orderList = await orderService.getAllOrders();
    res.status(200);
    res.send({Products:productList, Customers:customerList, Orders:orderList});
} 

// Responsible for String Validation for each relevant function
function isValidString(input){
    if (!input || typeof input !== "string" || input.trim() === '') { return false;}
    return true;
}

// Responsible for Number Validation for each relevant function
function isValidNumber(input){
    if (!input || isNaN(input) || input.trim() === '') { return false;}
    return true;
}

// Responsible for ID Validation for each relevant function
function isValidID(id){
    if (!isValidString(id)) { return false;}
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id) // Needed because ObjectId.isValid(id) allows Strings with length of 12 that aren't ObjectIDs.
            return true;                      // Checks if (new ObjectId created from string) cast to string, is the same Type of String       
        return false;
    }
    return false;
} 

// Responsible for Date Validation for each relevant function
function isValidDate(input){
    if (!input || isNaN(Date.parse(input)) || input.trim() === '') { return false;}
    return true;
} 
//Phone Number Validation
function isValidPhoneNumber(input){
    phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!input || !input.match(phoneRegex) || input.trim() === '') { return false;}
    return true;
} 

async function readProduct(req,res){
    
    const productId = req.body.ProductID;

    // Check if the ProductID is provided and is a valid ID
    if (!(isValidID(productId))) {
        return res.status(400).send({ error: 'Invalid Product ID' });
    }

    try {
        const product = await productService.getProductById(productId);
        // Check if a product with the given ProductID was found
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ Product: product });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function createNewProduct(req,res){
    
    const product = req.body.Product;
    if (!isValidString(product[0])) { return res.status(400).send({ error: 'Invalid Product Name' })}
    if (!isValidNumber(product[1])) { return res.status(400).send({ error: 'Invalid Product Price' })}
    if (!isValidString(product[2])) { return res.status(400).send({ error: 'Invalid Product Description' })}
    if (!isValidString(product[3])) { return res.status(400).send({ error: 'Invalid Product Picture' })}
    try {
        await productService.createProduct(product[0],product[1],product[2],product[3]);
        //await postToFacebook("Check out our new coockie - "+product[0]+" Only for "+product[1]);
        res.status(201).send({ Product: product[0] });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function updateAProduct(req,res){
    
    const product = req.body.Product;
    if (!isValidID(product[0])) { return res.status(400).send({ error: 'ID Altered! Do Not Delete The ID Field!' })}
    if (!isValidString(product[1])) { return res.status(400).send({ error: 'Invalid Product Name' })}
    if (!isValidNumber(product[2])) { return res.status(400).send({ error: 'Invalid Product Price' })}
    if (!isValidDate(product[3])) { return res.status(400).send({ error: 'Invalid Date. Enter as (Year-Month-Date Time) format' })}
    if (!isValidString(product[4])) { return res.status(400).send({ error: 'Invalid Product Description' })}
    if (!isValidString(product[5])) { return res.status(400).send({ error: 'Invalid Product Picture' })}
    try {
        const UpdatedProduct = await productService.updateProduct(product[0],product[1],product[2],new Date(product[3]),product[4],product[5]);
        if (!UpdatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ Product: product[1] });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function deleteAProduct(req,res){
    
    const productId = req.body.id;

    // Check if the ProductID is provided and is a valid ID
    if (!(isValidID(productId))) {
        return res.status(400).send({ error: 'ID Altered! Do Not Delete The ID Field!' });
    }

    try {
        const product = await productService.deleteProduct(productId);
        // Check if a product with the given ProductID was found
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ success: 'Deleted product' });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function deleteACategory(req,res){
    
    const categoryId = req.body.id;

    // Check if the ProductID is provided and is a valid ID
    if (!(isValidID(categoryId))) {
        return res.status(400).send({ error: 'ID Altered! Do Not Delete The ID Field!' });
    }

    try {
        const category = await categoryService.deleteCategory(categoryId);
        // Check if a product with the given ProductID was found
        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }
        res.status(200).send({ success: 'Deleted category' });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching category:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function readCustomer(req,res){

    const customerId = req.body.CustomerID;

    // Check if the CustomerID is provided and is a valid ID
    if (!(isValidID(customerId))) {
        return res.status(400).send({ error: 'Invalid Customer ID' });
    }

    try {
        const customer = await CustomerService.getCustomerById(customerId);
        // Check if a customer with the given CustomerID was found
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }

        res.status(200).send({ Customer: customer });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function updateACustomer(req,res){
    let {id, password, isAdmin} = req.body;
    if (password && password.length < 6) { return res.status(400).send({ error: 'Password should be more then 6 letters!' })}
    if (isAdmin != 'true' && isAdmin != 'false') { return res.status(400).send({ error: 'The user can only define as admin of not!' })}
    try {
        if(!password){
            password = null;
        }
        const UpdateUser = await UserService.updateUser(id, password, isAdmin);
        if (!UpdateUser) {
            return res.status(400).send({ error: 'User not found' });
        }
        res.status(200).send({ success: true });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

async function deleteACustomer(req,res){

    const customerId = req.body.id;
    try {
        const user = await UserService.deleteUser(customerId);

        //Check if a customer with the given CustomerID has a user found
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ success: 'Deleted user' });

    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }  
} 
async function updateOrder(req,res){
    let {id, status} = req.body;
    if (status != 'Pending for approval' && status != 'Approved' && status != 'Sent' && status != 'Delivered' && status != 'Canceled') { return res.status(400).send({ error: 'The status is not valid!' })}
    try {
        const UpdateOrder = await orderService.updateOrder(id, status);
        if (!UpdateOrder) {
            return res.status(400).send({ error: 'Order not found' });
        }
        res.status(200).send({ success: true });
    } catch (error) {
            // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


async function readOrder(req,res){

    const orderId = req.body.OrderID;

    // Check if the OrderID is provided and is a valid ID
    if (!(isValidID(orderId))) {
        return res.status(400).send({ error: 'Invalid Order ID' });
    }

    try {
        const order = await orderService.getOrderById(orderId);
        // Check if a order with the given OrderID was found
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }

        res.status(200).send({ Order: order });
    } catch (error) {
         // Handle any errors that may occur during the database operation
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
async function postToFacebook(postMessage){
    const API_URL = "https://graph.facebook.com/v17.0";
    const accessToken = "EAAEZAVtQEPhYBO50GrkLa3dvNFJAsrZCVs6SW8uBmH77ff8N7w8HIInAbQaZBbYq41ExMuCIq8muw5dyQTuUPMjVUUeOdSne5CfiChLxtZCMcBqSM4bZCJ8ZAG1hG3sD7RrTmHLz8s073tk1f8UZBr4lz1UsGcgTs85ZBHuEKQEMZC1DkzBniaVXRpJPm3UE47EdlPZBNx3pFvOmuokx8u4wZDZD"
    const pageRes = await fetch(API_URL+'/me?access_token='+accessToken+'&fields=id,name');
    const pageObj = await pageRes.json();
    const pageID = pageObj.id;
    
    console.log(API_URL+'/'+pageID+'/feed?access_token=')
     const postRes = await fetch(API_URL+'/'+pageID+'/feed?message='+postMessage+'&access_token='+accessToken,{
        method:"POST"
    })
   
}
async function getDashboardData(req, res) {
    const totalUsers = await CustomerModel.countDocuments({});
    const totalProducts = await ProductModel.countDocuments({});
    res.render('admin', { customers: customers, totalUsers, totalProducts });
}

async function addProduct(req, res) {
    const { name, category, description, price, image } = req.body;
    if(!name || !category || !price || !description || !image || name.length < 2 || description.length < 10 || image.length < 10 || price < 0)
        return res.json({ success: false, error: "Please fill all the fields!" });
    try {
        categoryCheck = await categoryService.getCategoryById(category);
        if(!categoryCheck) return res.json({ success: false, error: "Category not found" });
        product = await productService.createProduct(name, category, description, price, image);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error adding product: ", error);
        res.json({ success: false });
    }
}

async function addCategory(req, res) {
    const { name, description, image } = req.body;
    if(!name || !description || !image || name.length < 2 || description.length < 10 || image.length < 10)
        return res.json({ success: false, error: "Please fill all the fields!" });
    try {
        category = await categoryService.createCategory(name, description, image);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error adding product: ", error);
        res.json({ success: false });
    }
}
    
module.exports = {
    renderAdminPage,
    logout,
    getLists,
    readProduct,
    createNewProduct,
    addProduct,
    updateAProduct,
    deleteAProduct,
    readCustomer,
    updateACustomer,
    deleteACustomer,
    readOrder,
    updateOrder,
    addCategory,
    deleteACategory
}


exports.getDashboardData = getDashboardData;
exports.readOrder = readOrder;
exports.logout = logout;
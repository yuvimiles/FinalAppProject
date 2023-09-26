const CustomerService = require('../services/CustomerService');
const UserService = require('../services/UserService');
const orderService = require('../services/OrderService');
const CategoryService = require('../services/CategoryService');
const ProductService = require('../services/ProductService');
const bcrypt = require("bcryptjs");
// const isMatch = await bcrypt.compare(password, admin.password);
// const hashedPassword = await bcrypt.hash(password, 10); 


async function getIndex(req,res){
  const userLoggedIn = req.session.UserID != null;
  let isAdmin = false;
  if (userLoggedIn == true){
    const User = await UserService.getUserById(req.session.UserID);
    if(User.isAdmin == true){
      isAdmin = true;
    }
  }
  const categories = await CategoryService.getAllCategories();
  res.render('home', { userLoggedIn,isAdmin, categories });
}

async function getCart(req,res){
  const userLoggedIn = req.session.UserID != null;
  let isAdmin = false;
  if (userLoggedIn == true){
    const User = await UserService.getUserById(req.session.UserID);
    if(User.isAdmin == true){
      isAdmin = true;
    }
  }
  if(req.session.UserID!= null){ //user is logged in
      const products = await ProductService.getAllProducts();
      res.render('cart', { userLoggedIn,isAdmin, products });
  }else{
    res.redirect('/login')
  }
}

function getAbout(req,res){
  res.render('about');
}

function getContact(req,res){
  res.render('contact');
}

function getMaps(req,res){
  res.render('maps');
}

async function getCategory(req,res){
  const userLoggedIn = req.session.UserID != null;
  let isAdmin = false;
  if (userLoggedIn == true){
    const User = await UserService.getUserById(req.session.UserID);
    if(User.isAdmin == true){
      isAdmin = true;
    }
  }
  const category = await CategoryService.getCategoryByName(req.params.category);
  if(!category){
    const categories = await CategoryService.getAllCategories();
    res.render('home', { userLoggedIn,isAdmin, categories });
  }else{
    const products = await ProductService.getProductByCategoryId(category._id.toHexString());
    res.render('../views/category', { userLoggedIn,isAdmin,category,products });
  }
}


function GetLoginPage(req, res) {
    res.render('login', { error: null }); // 'auth' is a combined login/register EJS template
}
function GetRegisterPage(req, res) {
  res.render('register', { error: null }); // 'auth' is a combined login/register EJS template
}
async function getAccountPage(req, res) {
  if (!req.session.UserID) {
      // If the user isn't logged in, redirect to the login page
      return res.redirect('/login');
  }

  try {
      // Fetch the user's information
      const user = await UserService.getUserById(req.session.UserID)
      const customer = await CustomerService.getCustomerById(req.session.UserID)
      const orders = await orderService.getOrdersByCustomerId(req.session.UserID)
      if (!user) {
          // Handle situations where the user isn't found
          return res.status(404).send("User not found");
      }

      // Render the account page with the user's information
      res.render('account', { user,customer, userLoggedIn: true, orders });
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
  }
}


async function HandleAuth(req, res) {
    if (req.body.formType === 'login') {
        const User = await UserService.getUserByUsername(req.body.username);
        if (User === null) {
            res.render('login', { error: "Invalid username or password" });
        } else {
            const isMatch = await bcrypt.compare(req.body.password, User.Password);
            if(isMatch){
              req.session.UserID = User.id;
              res.redirect('/');
            }else{
              res.render('login', { error: "Invalid username or password" });
            }
        }
    } else if (req.body.formType === 'register') {
        const {username, password} = req.body;
        if(username.length < 2){
          res.render('register', {error: "The username must be at least 6 characters long"});
        }
        if(password.length < 6){
          res.render('register', {error: "The password must be at least 6 characters long"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserService.createUser(username, hashedPassword);
        if(newUser === null){
            res.render('register', {error: "Cannot create user, username is taken"});
        } else {
            const Customer = await CustomerService.createCustomer(newUser.id, username, req.body.phoneNumber, req.body.address)
            req.session.UserID = newUser.id;
            res.redirect('/');
        }
    } else {
        res.status(400).send('Invalid form type');
    }
}
 // ------------------------------ CRUD ++ ------------------------------------
const getAllCustomers = async (req, res) => {
    const Customers = await CustomerService.getAllCustomers();
    res.json(Customers);
};
const getCustomer = async (req, res) => {
    const Customer = await CustomerService.getCustomerById(req.session.UserID);
    res.send({Cust:Customer});
};
const updateCustomer = async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({
        message: "CustomerID is required",
      });
    }
  
    const Customer = await CustomerService.updateCustomer(req.params.id, req.body.name, req.body.phoneNumber, req.body.address);
    if (!Customer) {
      return res.status(404).json({ errors: ['Customer not found'] });
    }
  
    res.json(Customer);
  };
const deleteCustomer = async (req, res) => {
    const Customer = await CustomerService.deleteCustomer(req.params.id);
    if (!Customer) {
      return res.status(404).json({ errors: ['Customer not found'] });
    }
  
    res.send();
  };
const createUserAdmin = async (req, res) => {
        const {username, password} = req.body;
        const newUser = await UserService.createUser(username, password);
        if(newUser == null){
          res.render('register',{error: "Cannot create user, username is taken"});
        }else{
          if(!newUser.isAdmin){
          Cust = await CustomerService.createCustomer(newUser.id,req.body.username,req.body.name,req.body.phoneNumber,req.body.address)
          req.session.UserID=newUser.id;
          res.redirect('/');
          }else{
            res.redirect('/admin');
          }
        }
    };
const UserLogout = async (req,res)=>{
        req.session.destroy(()=>{
          Cust=null;
            res.redirect('/')
        })
    }
async function getAllUsers(req, res) {
    const users = await CustomerModel.find({});
    res.render('admin', { users });
}

async function placeOrder(req, res) {
  let price = 0;
  const  {address, city, country, zip, cart} = req.body;
  const errors = [];
  if(address.length < 2){
      errors.push("Address must be at least 2 characters long");
  }
  if(city.length < 2){
      errors.push("City must be at least 2 characters long");
  }
  if(country.length < 2){
      errors.push("Country must be at least 2 characters long");
  }
  if(zip.length != 5 && zip.length != 7){
      errors.push("Invalid Zip Code");
  }
  if(cart.length === 0){
      errors.push("Cart is empty");
  }else{
      products = await ProductService.getAllProducts();
      price = cart.reduce((acc, item) => acc + (item.Price * item.amount), 0);
      cart.forEach((item) => {
        const product = products.find((product) => product._id == item.id);
          if(!product){
              errors.push("Invalid product " + item.ProductName);
          }
          if(item.amount < 1){
            errors.push("Invalid amount for product " + cart[i].ProductName);
          }
      });
  }
  if(errors.length){
    return res.json({ errors });
  }else{
    await orderService.createOrder(req.session.UserID, address, city, country, zip, cart, price);
    return res.status(201).json({ message: ['Order Placed Successfully']});
  }
}

module.exports = {
    getAllCustomers,
    getCustomer,
    getMaps,
    getAbout,
    getContact,
    updateCustomer,
    deleteCustomer,
    getIndex,
    getAllUsers,
    getCart,
    GetLoginPage,
    GetRegisterPage,
    HandleAuth,
    createUserAdmin,
    getAccountPage,
    UserLogout,
    getCategory,
    placeOrder
  };


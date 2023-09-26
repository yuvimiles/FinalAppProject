const Customer = require('../models/CustomerModel');
//creating customer is auto after registration
// ID attribute is taken from registered Users
const createCustomer = async (id, username, phoneNumber, address) => {
    const customer = new Customer({
        _id : id,
        Username : username,
        phoneNumber : phoneNumber,
        Address : address
    });
    return await customer.save();
};

const getCustomerById = async (id) => {
    try {
        return await Customer.findById(id);
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        return null;
    }
};
const getAllCustomers = async () => {
    return await Customer.find({});
};
const updateCustomer = async (id, name, phonenumber, address) => { // update details about customer
    const customer = await getCustomerById(id);
    if (!customer)
        return null;

    customer.Name =name;
    customer.phoneNumber = phonenumber;
    customer.Address = address;
    
    return await Customer.updateMany({_id:id}, {$set:{Name: name,phoneNumber: phonenumber,Address: address,}});
//*after order is created maybe need to update customer orders */
};
 //------------------------------ ONLY FOR ADMINS!!!!----------------------------
const deleteCustomer = async (id) => {
    const customer = await getCustomerById(id);
    if (!customer)
        return null;
    // DELETE CUSTOMER CART && USER
   
    return await Customer.findByIdAndRemove(id);
};
module.exports = {
    createCustomer,
    getCustomerById,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
}
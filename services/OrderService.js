const Order = require('../models/OrderModel').OrderModel;

const createOrder = async (user, address, city, country, zip, cart, price) => {
    const order = new Order({
        UserId: user,
        Products: cart,
        Address: address,
        City: city,
        Country: country,
        Zip: zip,
        Price: price,
        Date: Date.now(),
        Status: "Pending for approval"
    });
    return await order.save();
};

const getOrderById = async (id) => {
    return await Order.findById(id);
};

const getAllOrders = async () => {
    return await Order.find({});
};

const getOrdersByCustomerId = async (user) => {
    return await Order.find({UserId: user});
};

const updateOrderProducts = async (id, products) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    order.Products = products;
    order.Quantity = products.length;
    order.Price = 0;
    for(let i=0;i<products.length;i++){
        order.Price += products[i].Pricerice
    }
    order.Date = Date.now;
    await order.save();
    return order;
};

const aggregateLast5Weeks = async () => {
    const pipeline = [
        {
            $project: {
                week: { $isoWeek: "$Date" },
                orderAmount: "$Price"
            }
        },
        {
            $group: {
                _id: "$week",
                ordersAmount: { $sum: 1 }, // Count the number of orders per week
                totalAmount: { $sum: "$orderAmount" }
            }
        },
        {
            $sort: { _id: -1 }
        },
        {
            $limit: 5
        }
    ];

    const result = await Order.aggregate(pipeline);
    const weeks = [];
    result.forEach(doc => {
        const week = {
            id: doc._id,
            value: doc.ordersAmount,
            region: "Week #"+ doc._id + " Total of " + doc.totalAmount + " Incomes"
        }
        weeks.push(week);
    });
    return weeks;
}

const updateOrder = async (id, status) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    order.Status = status;
    await order.save();
    return order;
};

const deleteOrder = async (id) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    await order.remove();
    return order;
};

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderProducts,
    deleteOrder,
    getOrdersByCustomerId,
    updateOrder,
    aggregateLast5Weeks
}
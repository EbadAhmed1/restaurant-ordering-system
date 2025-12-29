const Order = require('../models/Order');
const Menu = require('../models/Menu');
const OrderItem = require('../models/OrderItem');
const Payment = require('../models/Payment');

exports.createOrder = async (userId, items, paymentMethod = 'COD', cardDetails = null) => {
    const itemIds = items.map(item => item.menuId);

    const menuItems = await Menu.findAll({ 
        where: { 
            id: itemIds,
            isAvailable: true 
        } 
    });

    if (menuItems.length !== itemIds.length) {
        throw new Error(`Order failed. One or more items are invalid or unavailable.`);
    }

    let serverCalculatedTotal = 0;
    const orderItemsData = [];
    
    for (const requestedItem of items) {
        const menuItem = menuItems.find(item => item.id === requestedItem.menuId);
        
        if (requestedItem.quantity <= 0) throw new Error(`Invalid quantity.`);

        const itemPrice = parseFloat(menuItem.price);
        const subtotal = itemPrice * requestedItem.quantity;
        serverCalculatedTotal += subtotal;
        
        orderItemsData.push({
            menuId: menuItem.id,
            quantity: requestedItem.quantity,
            priceAtOrder: itemPrice,
            subtotal: subtotal
        });
    }

    const newOrder = await Order.create({
        userId: userId,
        totalAmount: serverCalculatedTotal.toFixed(2),
        status: 'Pending'
    });

    const itemsWithOrderId = orderItemsData.map(item => ({
        ...item,
        orderId: newOrder.id
    }));

    await OrderItem.bulkCreate(itemsWithOrderId);

    const transactionId = paymentMethod === 'Card' 
        ? `TXN-${Date.now()}-${newOrder.id}` 
        : `COD-${newOrder.id}`;

    await Payment.create({
        orderId: newOrder.id,
        transactionId: transactionId,
        paymentMethod: paymentMethod === 'Card' ? 'Credit Card' : 'COD',
        amountPaid: serverCalculatedTotal.toFixed(2),
        status: 'Success'
    });

    return newOrder;
};

exports.getOrderHistory = async (userId) => {
    const orders = await Order.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']], 
        include: [{ 
            model: OrderItem, 
            as: 'items',
            include: [{ 
                model: Menu, 
                as: 'menuItem', 
                attributes: ['name', 'price', 'imageUrl'] 
            }] 
        }]
    });

    return orders;
};
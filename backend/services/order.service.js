const Order = require('../models/Order'); // Sequelize Order Model
const Menu = require('../models/Menu');   // Sequelize Menu Model
const OrderItem = require('../models/OrderItem'); // Import the new OrderItem model

/**
 * Service function to create a new order.
 * 1. Validates item availability.
 * 2. Recalculates the total amount server-side.
 * 3. Creates the order and order items.
 */
exports.createOrder = async (userId, items) => {
    // --- 1. Server-Side Price and Availability Check ---
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
        
        // Prepare data for the OrderItem table
        orderItemsData.push({
            menuId: menuItem.id,
            quantity: requestedItem.quantity,
            priceAtOrder: itemPrice,
            subtotal: subtotal
        });
    }

    // --- 2. Create the Order ---
    const newOrder = await Order.create({
        userId: userId,
        totalAmount: serverCalculatedTotal.toFixed(2),
        status: 'Pending'
    });

    // --- 3. Create Order Items (Bulk Insert) ---
    // Attach the new orderId to each item
    const itemsWithOrderId = orderItemsData.map(item => ({
        ...item,
        orderId: newOrder.id
    }));

    await OrderItem.bulkCreate(itemsWithOrderId);

    return newOrder;
};

/**
 * Service function to retrieve a user's order history.
 */
exports.getOrderHistory = async (userId) => {
    const orders = await Order.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']], 
        include: [{ 
            model: OrderItem, 
            as: 'items',
            include: [{ model: Menu, as: 'menuItem', attributes: ['name'] }] 
        }]
    });

    return orders;
};
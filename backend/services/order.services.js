const Order = require('../models/Order'); // Sequelize Order Model
const Menu = require('../models/Menu');   // Sequelize Menu Model

/**
 * Service function to create a new order.
 * * This layer encapsulates business logic:
 * 1. Validates item availability and integrity.
 * 2. Recalculates the total amount on the server-side to prevent client-side fraud.
 * 3. Creates the order record.
 *
 * @param {number} userId - ID of the user placing the order.
 * @param {Array<Object>} items - Array of { menuId: number, quantity: number }
 * @returns {Promise<Object>} - The newly created order object.
 */
exports.createOrder = async (userId, items) => {
    // --- 1. Server-Side Price and Availability Check ---
    
    // Get all unique menu item IDs from the requested items
    const itemIds = items.map(item => item.menuId);

    // Fetch the menu items from the database
    const menuItems = await Menu.findAll({ 
        where: { 
            id: itemIds,
            isAvailable: true // Ensure only available items are included
        } 
    });

    if (menuItems.length !== itemIds.length) {
        // This means one or more items were either unavailable or not found
        const foundIds = menuItems.map(item => item.id);
        const missingIds = itemIds.filter(id => !foundIds.includes(id));
        
        throw new Error(`Order failed. Items not found or unavailable: ${missingIds.join(', ')}`);
    }

    // --- 2. Calculate Server-Side Total and Format Order Details ---
    let serverCalculatedTotal = 0;
    const formattedItems = [];
    
    for (const requestedItem of items) {
        const menuItem = menuItems.find(item => item.id === requestedItem.menuId);
        
        // Ensure quantity is positive
        if (requestedItem.quantity <= 0) {
            throw new Error(`Invalid quantity for item ID ${requestedItem.menuId}`);
        }

        const itemPrice = parseFloat(menuItem.price);
        const subtotal = itemPrice * requestedItem.quantity;
        serverCalculatedTotal += subtotal;
        
        // Prepare data for storage in the Order.items JSON column
        formattedItems.push({
            menuId: menuItem.id,
            name: menuItem.name,
            price: itemPrice,
            quantity: requestedItem.quantity,
            subtotal: subtotal.toFixed(2)
        });
    }

    // can add tax/delivery fee logic here later, if needed.

    // --- 3. Create the Order in the Database ---
    const newOrder = await Order.create({
        userId: userId,
        items: formattedItems,      // Stored as JSON
        totalAmount: serverCalculatedTotal.toFixed(2), // Store the server-calculated total
        status: 'Pending'           // Initial status
    });

    // --- 4. (Future) Update Inventory/Stock Levels Here ---

    return newOrder;
};


/**
 * Service function to retrieve a user's order history.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Array<Object>>} - An array of order objects.
 */
exports.getOrderHistory = async (userId) => {
    // Include the User model if you want user details in the order history
    const orders = await Order.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']], // Latest orders first
    });

    return orders;
};
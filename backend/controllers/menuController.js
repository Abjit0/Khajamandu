const MenuItem = require('../models/menuModel');

// Get all menu items for a restaurant
exports.getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const menuItems = await MenuItem.find({ 
      restaurantId,
      isAvailable: true 
    }).sort({ category: 1, name: 1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch menu items'
    });
  }
};

// Get all menu items (for browsing)
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, search, restaurant } = req.query;
    let filter = { isAvailable: true };

    if (category) filter.category = category;
    if (restaurant) filter.restaurantName = new RegExp(restaurant, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const menuItems = await MenuItem.find(filter)
      .sort({ restaurantName: 1, category: 1, name: 1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get all menu items error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch menu items'
    });
  }
};

// Add new menu item (Restaurant only)
exports.addMenuItem = async (req, res) => {
  try {
    console.log('📥 Add menu item request from:', req.user?.email, 'Role:', req.user?.role);
    console.log('📦 Request body:', req.body);
    
    // Verify user is restaurant owner
    if (req.user.role !== 'restaurant') {
      console.log('❌ User is not a restaurant:', req.user.role);
      return res.status(403).json({
        status: 'FAILED',
        message: 'Only restaurants can add menu items'
      });
    }

    const menuItemData = {
      ...req.body,
      restaurantId: req.user.id,
      restaurantName: req.user.profile.restaurantName || 'Restaurant'
    };

    console.log('💾 Creating menu item:', menuItemData);

    const newMenuItem = new MenuItem(menuItemData);
    await newMenuItem.save();

    console.log(`✅ Menu item added: ${newMenuItem.name} by ${req.user.email}`);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Menu item added successfully',
      data: newMenuItem
    });
  } catch (error) {
    console.error('❌ Add menu item error:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to add menu item',
      error: error.message
    });
  }
};

// Update menu item (Restaurant only)
exports.updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find the menu item and verify ownership
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Menu item not found'
      });
    }

    if (menuItem.restaurantId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'You can only update your own menu items'
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    console.log(`✅ Menu item updated: ${updatedMenuItem.name}`);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Menu item updated successfully',
      data: updatedMenuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to update menu item'
    });
  }
};

// Delete menu item (Restaurant only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find the menu item and verify ownership
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Menu item not found'
      });
    }

    if (menuItem.restaurantId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'You can only delete your own menu items'
      });
    }

    await MenuItem.findByIdAndDelete(itemId);

    console.log(`✅ Menu item deleted: ${menuItem.name}`);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to delete menu item'
    });
  }
};

// Toggle item availability (Restaurant only)
exports.toggleAvailability = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Menu item not found'
      });
    }

    if (menuItem.restaurantId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'You can only update your own menu items'
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    console.log(`✅ Menu item availability toggled: ${menuItem.name} - ${menuItem.isAvailable ? 'Available' : 'Out of Stock'}`);

    res.status(200).json({
      status: 'SUCCESS',
      message: `Menu item marked as ${menuItem.isAvailable ? 'available' : 'out of stock'}`,
      data: menuItem
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to update item availability'
    });
  }
};

// Get restaurant's own menu items (for management)
exports.getMyMenuItems = async (req, res) => {
  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({
        status: 'FAILED',
        message: 'Only restaurants can access this endpoint'
      });
    }

    const menuItems = await MenuItem.find({ 
      restaurantId: req.user.id 
    }).sort({ category: 1, name: 1 });

    res.status(200).json({
      status: 'SUCCESS',
      results: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get my menu items error:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to fetch your menu items'
    });
  }
};
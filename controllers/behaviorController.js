const Behavior = require('../models/Behavior');
const Item = require('../models/Item');


// Get all behaviors
exports.getBehaviors = async (req, res) => {
  try {
    const { userId } = req.query;
    const behaviors = await Behavior.find({ userId }).populate('items'); // populate items
    res.json(behaviors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Add behavior
exports.addBehavior = async (req, res) => {
  try {
    const behavior = await Behavior.create({ 
      bname: req.body.name,  
      userId: req.body.userId, 
      items: [] 
    });
    res.json(behavior);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete behavior
exports.deleteBehavior = async (req, res) => {
  try {
    const behaviorId = req.params.id;

    // Find the Behavior document
    const behavior = await Behavior.findById(behaviorId).populate('items');
    if (!behavior) {
      return res.status(404).json({ message: 'Behavior not found' });
    }

    // Delete items associated with the behavior
    for (let item of behavior.items) {
      await Item.findByIdAndDelete(item._id); // Delete each item
    }

    // Delete the behavior
    await Behavior.findByIdAndDelete(behaviorId);

    res.json({ message: 'Behavior and associated items deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update behavior
// In behaviorController.js
exports.updateBehavior = async (req, res) => {
  try {
    const behavior = await Behavior.findByIdAndUpdate(
      req.params.id,  // Get the behavior by the ID from the URL
      { bname: req.body.name },  // Update the behavior's `bname` field with the new name
      { new: true }  // Return the updated behavior
    );
    if (!behavior) {
      return res.status(404).json({ message: "Behavior not found" });
    }
    res.json(behavior);  // Respond with the updated behavior
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating behavior" });
  }
};




// Get items by user
exports.getItemsByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const behaviors = await Behavior.find({ userId });

    // Extract all items from each behavior
    const items = behaviors.flatMap(b => b.items);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.addItem = async (req, res) => {
  try {
    const behaviorId = req.params.id;

    // Create and save item
    const newItem = new Item({
      name: req.body.name,
      behaviorId: behaviorId
    });
    await newItem.save();

    // Push only newItem._id to Behavior's items array
    await Behavior.findByIdAndUpdate(
      behaviorId,
      { $push: { items: newItem._id } },  // Push _id, not object
      { new: true }
    );

    res.json({ message: 'Item added', item: newItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const behaviorId = req.params.id;
    const itemId = req.params.itemId;

    // Find the Behavior by ID
    const behavior = await Behavior.findById(behaviorId);
    if (!behavior) {
      return res.status(404).json({ message: 'Behavior not found' });
    }

    // Remove the item ID from the Behavior's items array
    behavior.items = behavior.items.filter(item => item.toString() !== itemId);
    await behavior.save();

    // Delete the Item from the Item collection
    await Item.findByIdAndDelete(itemId);

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    // Find the item in the Item collection by its ID
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update the item's name
    item.name = req.body.name;

    // Save the updated item
    await item.save();

    res.json(item);  // Return the updated item
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error while updating item" });
  }
};

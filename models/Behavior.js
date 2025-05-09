const mongoose = require('mongoose');

// Behavior schema to store behavior data
const behaviorSchema = new mongoose.Schema({
    bname: {
        type: String,
        required: true  // Name of the behavior is required
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Link to the user that owns this behavior
        required: true
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]  // Link to items
});

const Behavior = mongoose.model('Behavior', behaviorSchema);

module.exports = Behavior;

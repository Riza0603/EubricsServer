const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    behaviorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Behavior',  // Reference to the Behavior model
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

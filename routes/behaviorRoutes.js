const express = require('express');
const router = express.Router();
const behaviorController = require('../controllers/behaviorController');

// Routes
router.get('/', behaviorController.getBehaviors);
router.post('/', behaviorController.addBehavior);
router.delete('/:id', behaviorController.deleteBehavior);
router.put('/:id', behaviorController.updateBehavior);


// Items routes
router.post('/:id/items', behaviorController.addItem);
router.delete('/:id/items/:itemId', behaviorController.deleteItem);
router.get('/items', behaviorController.getItemsByUser); 
router.put('/items/:itemId', behaviorController.updateItem);



module.exports = router;

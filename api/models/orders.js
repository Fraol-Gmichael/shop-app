const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    quantity: {type: Number, default: 1},
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
});

module.exports = mongoose.model('Order', orderSchema);
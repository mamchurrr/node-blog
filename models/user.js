const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', schema);
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    }
});

const News = mongoose.models.news || mongoose.model('news', newsSchema);

module.exports = News;
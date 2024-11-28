const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  no_of_people: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  ratings: { type: Number, default: 0 },
  available_dates: [{ type: Date }],
});

module.exports = mongoose.model('Listing', ListingSchema);

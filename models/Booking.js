const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  guest_names: { type: [String], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
});

module.exports = mongoose.model('Booking', BookingSchema);

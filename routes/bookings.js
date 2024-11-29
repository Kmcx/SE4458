const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuthorization = require('../middleware/role');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a stay. Authentication needed. Can used by user type:"Guest".
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingId:
 *                 type: string
 *                 description: ID of the listing to book
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               guest_names:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Names of guests for the booking
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or unavailable listing
 *       500:
 *         description: Server error
 */
router.post('/', auth, roleAuthorization(['guest']), async (req, res) => {
  const { listingId, from_date, to_date, guest_names } = req.body;

  try {
    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    
    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);
    if (fromDate >= toDate) {
      return res.status(400).json({ msg: 'Invalid date range' });
    }

    
    const overlappingBooking = await Booking.findOne({
      listingId,
      $or: [
        { from_date: { $lte: toDate, $gte: fromDate } },
        { to_date: { $gte: fromDate, $lte: toDate } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ msg: 'Listing is unavailable for the selected dates' });
    }

   
    const booking = new Booking({
      listingId,
      guestId: req.user.id,
      from_date: fromDate,
      to_date: toDate,
      guest_names,
    });

    await booking.save();
    res.status(201).json({ status: 'successful', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the logged-in guest. Authentication needed.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       listingId:
 *                         type: string
 *                       from_date:
 *                         type: string
 *                         format: date
 *                       to_date:
 *                         type: string
 *                         format: date
 *                       guest_names:
 *                         type: array
 *                         items:
 *                           type: string
 *                       status:
 *                         type: string
 *     500:
 *       description: Server error
 */
router.get('/', auth, roleAuthorization(['guest']), async (req, res) => {
    try {
      // Find bookings for the logged-in guest
      const bookings = await Booking.find({ guestId: req.user.id }).populate('listingId', 'title country city price');
      res.json({ bookings });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;

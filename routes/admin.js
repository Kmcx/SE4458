const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuthorization = require('../middleware/role');
const Listing = require('../models/Listing');

/**
 * @swagger
 * /api/admin/report-listings:
 *   get:
 *     summary: Get listings filtered by country, city, and ratings.Authentication needed.Can used by user type:"Admin"
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: min_rating
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum rating to filter listings
 *       - in: query
 *         name: max_rating
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum rating to filter listings
 *     responses:
 *       200:
 *         description: List of filtered listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       ratings:
 *                         type: number
 *                       price:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get('/report-listings', auth, roleAuthorization(['admin']), async (req, res) => {
  const { country, city, min_rating, max_rating } = req.query;

  try {
    // Build query based on parameters
    let query = {};

    if (country) query.country = country;
    if (city) query.city = city;
    if (min_rating) query.ratings = { $gte: parseFloat(min_rating) };
    if (max_rating) query.ratings = { ...(query.ratings || {}), $lte: parseFloat(max_rating) };

    // Retrieve listings matching the criteria
    const listings = await Listing.find(query, 'title country city ratings price');
    res.json({ listings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/admin/listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Listing ID
 *                       hostId:
 *                         type: string
 *                         description: Host ID
 *                       title:
 *                         type: string
 *                         description: Title of the listing
 *                       country:
 *                         type: string
 *                         description: Country where the listing is located
 *                       city:
 *                         type: string
 *                         description: City where the listing is located
 *                       price:
 *                         type: number
 *                         description: Price per night
 *                       ratings:
 *                         type: number
 *                         description: Average rating of the listing
 *                       available_dates:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date
 *                           description: Available dates for the listing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/listings', auth, roleAuthorization(['admin']), async (req, res) => {
  try {
    const listings = await Listing.find({}, '-__v'); // Exclude the __v field
    res.json({ listings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;

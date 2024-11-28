const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');
const roleAuthorization = require('../middleware/role');

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: Insert a new listing. Can used by user type:"Host". Authentication needed.
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               no_of_people:
 *                 type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth,roleAuthorization(['host']), async (req, res) => {
  try {
    const { title, no_of_people, country, city, price } = req.body;

    const newListing = new Listing({
      hostId: req.user.id,
      title,
      no_of_people,
      country,
      city,
      price,
    });

    const listing = await newListing.save();
    res.status(201).json({ status: 'successful', listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     summary: Update a listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               no_of_people:
 *                 type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', auth,roleAuthorization(['host']), async (req, res) => {
  try {
    const { title, no_of_people, country, city, price } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing || listing.hostId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Listing not found or unauthorized' });
    }

    listing.title = title || listing.title;
    listing.no_of_people = no_of_people || listing.no_of_people;
    listing.country = country || listing.country;
    listing.city = city || listing.city;
    listing.price = price || listing.price;

    await listing.save();
    res.json({ status: 'successful', listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth,roleAuthorization(['host']), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || listing.hostId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Listing not found or unauthorized' });
    }

    await listing.remove();
    res.json({ status: 'successful', message: 'Listing deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/listings/search:
 *   get:
 *     summary: Query Listings by title,date or place. No authentication needed. Any type of users can use.
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for availability
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for availability
 *       - in: query
 *         name: no_of_people
 *         schema:
 *           type: integer
 *         description: Minimum number of people the listing should accommodate
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
 *     responses:
 *       200:
 *         description: List of matching listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {
  const { from_date, to_date, no_of_people, country, city } = req.query;

  try {
   
    let query = {};

    // Add filters to the query object based on user input
    if (country) query.country = country;
    if (city) query.city = city;
    if (no_of_people) query.no_of_people = { $gte: Number(no_of_people) }; // Match listings that can accommodate at least this many people

    // If date range is provided, filter for listings with matching available dates
    if (from_date && to_date) {
      const fromDate = new Date(from_date);
      const toDate = new Date(to_date);

      query.available_dates = {
        $elemMatch: {
          $gte: fromDate,
          $lte: toDate,
        },
      };
    }

    // Find matching listings in the database
    const listings = await Listing.find(query);
    res.json({ listings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


/**
 * @swagger
 * /api/listings/my-listings:
 *   get:
 *     summary: Get all listings created by the host
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: List of listings created by the host
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get('/my-listings', auth, roleAuthorization(['host']), async (req, res) => {
  try {
    const listings = await Listing.find({ hostId: req.user.id });
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
 *     summary: Get all listings for admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all listings
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get('/admin/listings', auth, roleAuthorization(['admin']), async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json({ listings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

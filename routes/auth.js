const express = require('express');
const router =express.Router();
const { register,login} = require('../controllers/authController');

router.post('register',register);
router.post('/login',login);


/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - email
 *              - password
 *              - role
 * 
 *          properties:
 *              username:
 *                  type: string
 *                  description: The user's username
 *              email:
 *                  type: string
 *                  description: The user's email
 *              password:
 *                  type: string
 *                  description: The user's password
 *              role:
 *                  type: string
 *                  enum: [host, guest]
 *                  description: The role of the user
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User registered seccesfully
 *          400:
 *              description: User already exists
 *          500:
 *              description: Server error
 */
router.post('/register',register);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Login a user
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email: 
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: User logged in succesfully
 *          400:
 *              description: Invalid credentials
 *          500:
 *              decription: Server error
 */
router.post('/login',login);

module.exports=router;

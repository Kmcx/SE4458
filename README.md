4458 Midterm API project for a short-term stay company 

Presentation video link : https://youtu.be/vtan-WZrkOQ

Features
Guests:
-Search for available listings by location, dates, and number of people.
-Book listings for specific dates.
-View their bookings (past and upcoming).

Hosts:
-Create, update, and delete listings.
-View all their created listings.


Admins:
-Generate reports on listings filtered by country, city, and ratings.

Tech Stack
Backend Framework: Node.js with Express.js,
Database: MongoDB (Mongoose ODM),
Authentication: JWT-based authentication,
API Documentation: Swagger UI,
Deployment : Render

Prerequisites
Node.js (v14 or higher)
MongoDB (local or cloud instance)

Swagger UI URL: https://se4458.onrender.com/api-docs/

API Endpoints
Authentication:
Method	Endpoint	             Description
POST	/api/auth/register  	    Register a new user (host/guest)
POST	/api/auth/login	            Login and get a JWT token

Listings:
Method	Endpoint	             Description
POST	/api/listings	            Create a new listing (Host only)
PUT	    /api/listings/:id   	    Update a listing (Host only)
DELETE	/api/listings/:id	        Delete a listing (Host only)
GET 	/api/listings/search    	Search for listings (Guests)
GET	    /api/listings/my-listings	View host's listings (Host only)

Bookings:
Method	Endpoint	               Description
POST	/api/bookings           	Book a listing (Guests)
GET	    /api/bookings	            View guest's bookings (Guests)

Admin:
Method	Endpoint	                Description
GET	    /api/admin/report-listings	Report listings by country,city,rating
GET     /api/admin/listings         Get all listings


How to Use
1. Authentication
Register: Use the /api/auth/register endpoint to register a user. Specify the role as either guest or host.
Login: Use the /api/auth/login endpoint to get a JWT token. Include this token in the Authorization header for all subsequent requests to protected routes.
2. Guests
Search Listings: Use /api/listings/search with optional query parameters (country, city, from_date, to_date, no_of_people) to find listings.
Book a Listing: Use /api/bookings with the required payload.
View Bookings: Use /api/bookings to get a list of all bookings.
3. Hosts
Manage Listings: Use /api/listings to create, update, or delete listings.
View Listings: Use /api/listings/my-listings to see all listings created by the host.
4. Admins
Generate Reports: Use /api/admin/report-listings with query parameters (country, city, min_rating, max_rating) to filter listings.

For Admin User Testing:
email: admin
password: hoca



Clone the repository:
git clone (https://github.com/Kmcx/SE4458.git)
Render: https://se4458.onrender.com



Install dependencies:
npm install




PORT=5000

Start the server:
node server.js




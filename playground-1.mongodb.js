// Select your actual database (replace 'campus' with your database name if needed)
use('campus');

// Insert the admin user
db.users.insertOne({
  username: "admin",
  email: "smveeresh22@gmail.com",
  password: "maraveva", // For local testing; hash in production!
  isAdmin: true
});

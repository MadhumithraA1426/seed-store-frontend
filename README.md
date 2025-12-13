# Plant Seed E-commerce Full Stack Application

A complete full-stack e-commerce application for selling plant seeds with personalized recommendations based on soil type, climate, and water conditions.

## Features

- **User Authentication**: Register and login for users and admins
- **Product Management**: Admin can upload, edit, and delete products
- **Shopping Cart**: Users can add products to cart and manage quantities
- **Order Management**: COD (Cash on Delivery) payment with address collection
- **Email Notifications**: Automatic email sent to users when order is placed
- **Seed Recommendations**: Intelligent recommendation system based on:
  - Soil type (clay, sandy, loamy, silt, chalky, peaty)
  - Climate (tropical, temperate, arid, continental, polar)
  - Water conditions (low, moderate, high)
- **Admin Dashboard**: Complete admin panel for managing products and orders
- **Responsive Design**: Modern, beautiful UI that works on all devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email
- Multer for file uploads

### Frontend
- React
- React Router
- Axios for API calls
- Context API for state management

## Project Structure

```
fullstack-seed/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── recommendations.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seed-ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you'll need to:
- Enable 2-factor authentication
- Generate an App Password (not your regular password)
- Use the App Password in `EMAIL_PASS`

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

**Note:** This project uses Vite instead of Create React App for faster development and better performance.

The frontend will run on `http://localhost:3000`

## Creating an Admin User

To create an admin user, you can use MongoDB directly or create a script. Here's a quick way using MongoDB shell:

```javascript
// Connect to MongoDB
use seed-ecommerce

// Create admin user (password will be hashed automatically)
db.users.insertOne({
  name: "Admin",
  email: "admin@seedstore.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash your password
  isAdmin: true
})
```

Or you can modify the registration route temporarily to allow admin creation, or use a tool like Postman to create a user and then manually update the database to set `isAdmin: true`.

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: Your email address for sending emails
- `EMAIL_PASS`: Your email app password

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:itemId` - Update cart item (protected)
- `DELETE /api/cart/remove/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Recommendations
- `GET /api/recommendations` - Get recommended products (protected)

## Features in Detail

### Seed Recommendation System
The recommendation system analyzes:
1. **Soil Type**: Matches products that grow well in the user's soil type
2. **Climate**: Suggests seeds suitable for the user's climate zone
3. **Water Conditions**: Recommends plants based on water availability

Products are scored and sorted by how well they match the user's conditions.

### Email Notifications
When an order is placed:
- An email is automatically sent to the user
- Email includes order details, delivery address, and expected delivery date (5 days from order)
- Delivery confirmation sent with personalized message

### Admin Features
- Upload products with images
- Set product attributes (soil type, climate, water requirements)
- View and manage all orders
- Update order status
- Delete products

## Production Deployment

### Backend
1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible
3. Make sure uploads directory is writable
4. Use a process manager like PM2

### Frontend
1. Build the production version:
```bash
npm run build
```
2. Deploy the `build` folder to your hosting service
3. Update API URLs if needed

## License

This project is open source and available for personal and commercial use.



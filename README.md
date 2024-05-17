# Inventory Management System

## Overview
The Inventory Management System is a web application built using Express, React, Tailwind CSS, Node.js, and MySQL. This system manages inventory and orders, with different roles such as Admin, Manager, and Customer. Admins and Managers can order products from suppliers, while Customers can order products from Admins and Managers.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [User Roles and Permissions](#user-roles-and-permissions)

## Getting Started

### Prerequisites
- Node.js
- MySQL (xamp server)
- npm

### Technologies used
1. **Frontend**: React, Tailwind CSS
2. **Backend**: Express, Node.js
3. **Database**: MySQL (Xamp Server)
4. **Authentication**: JWT

### Installation
1. Clone the repository
2. cd Backend
3. npm install
4. cd ../Frontend
5. npm install
6. Set up your .env file in the Backend directory
7. Set up you DB connection in the config directory of Backend 
### Running the Application 
1. cd Backend
2. npm run dev
3. cd ../Frontend
4. npm run dev

## Database Schema
The MySQL database consists of the following tables:
- **users**
Stores information about the system users, including admins, managers, and customers.
- **suppliers**
Stores information about product suppliers, including their contact details and categories they supply.
- **categories**
Stores the various product categories available in the system.
- **products**
Stores information about the products, including their details, prices, quantity, and associated supplier.
- **orders**
Stores information about customer orders, including the date, status, and the user who placed the order.
- **order_product_details**
Stores details of the products in each order, including the quantity and associated supplier.
- **supplier_categories**
Stores the relationship between suppliers and the categories they supply.

## API Endpoints

### User Routes
#### Manager Routes
- `POST /manager/admin/delete`: Delete an admin (Manager only)
- `GET /manager/getAdmins`: Get all admins (Manager only)
- `POST /manager/addAdmin`: Add a new admin (Manager only)

#### Customer Routes
- `POST /customer/register`: Register a new customer

#### Common Routes
- `POST /login`: Login for all entities (Admin, Manager, Customer)
- `GET /details`: Get user details
- `POST /change/profileImage`: Change user profile image

#### Admin Routes
- `GET /logout`: Logout user
- `POST /forgotPassword`: Request password reset
- `POST /resetPassword`: Reset user password
- `POST /isTokenValid`: Check if reset token is valid
- `GET /getAllUsers`: Get all users

### Inventory Routes
#### Admin and Manager Routes
- `POST /addSupplier`: Add a new supplier (Admin and Manager only)
- `POST /removeSupplier`: Remove a supplier using their NTN number (Admin and Manager only)
- `POST /addProduct`: Add a new product, quantity set to zero initially (Admin and Manager only)
- `POST /suplier/order`: Place an order to a supplier (Admin and Manager only)
- `GET /supplier/updateOrder/:order_id/:supplier_NTN`: Update supplier order (Admin and Manager only)
- `POST /customer/updateOrder`: Update a customer's order (Admin and Manager only)
- `GET /most-sold-categories`: Get data of most sold categories (Admin and Manager only)
- `GET /getSupplierDetails`: Get details of suppliers (Admin and Manager only)
- `GET /getAllCustomerOrders`: Get all customer orders (Admin and Manager only)
- `GET /getAllProducts`: Get all products
- `GET /getAllCategories`: Get all categories
- `GET /getTotalSales`: Get total sales data (Admin and Manager only)

#### Customer Routes
- `POST /customer/order`: Place an order as a customer


## User Roles and Permissions

- **Admin**: Full access to all features and data. Can manage users, products, and orders.
- **Manager**: Can manage products and orders, but cannot manage users.
- **Customer**: Can view products and place orders.




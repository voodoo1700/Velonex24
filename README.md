# Velonex24 - Modern Logistics & Courier Management

Velonex24 is a production-ready, real-time logistics management platform designed for efficiency and scale. It provides a seamless experience for tracking shipments, communicating via live chat, and managing complex courier operations through a secure administrative portal.

![Velonex24 Banner](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

## 🚀 Key Features

*   **Real-Time Shipment Tracking**: Monitor deliveries with live status updates and precise location tracking.
*   **Secure Admin Portal**: Hardened administrative interface for managing users, shipments, and system configurations.
*   **Live Chat & Messaging**: Integrated real-time communication between administrators and logistics personnel using Socket.io.
*   **Dynamic Dashboard**: High-performance data visualization for logistics metrics and operational health.
*   **Mobile-Responsive Design**: Fully optimized for a premium experience across all devices.

## 🛠️ Technology Stack

### Frontend
- **React 18** with **Vite** for lightning-fast development and performance.
- **Tailwind CSS** for modern, responsive styling.
- **Socket.io-client** for real-time bidirectional communication.
- **React Router** for seamless navigation.

### Backend
- **Node.js** & **Express** for a robust, scalable REST API.
- **MongoDB** with **Mongoose** for flexible and reliable data storage.
- **Socket.io** handles real-time messaging and status broadcasts.
- **JWT Authentication** for secure access control.

## 📂 Project Structure

```text
├── client/          # React frontend (Vite)
├── server/          # Node.js Express backend
├── .env.example     # Template for environment variables
└── DEPLOYMENT_GUIDE.md # Detailed production deployment instructions
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)
- npm or yarn

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/voodoo1700/Velonex24.git
   cd Velonex24
   ```

2. **Install Dependencies**:
   ```bash
   # From the root directory
   npm install --prefix client
   npm install --prefix server
   ```

3. **Environment Setup**:
   - Create a `.env` file in both `client/` and `server/` folders based on the respective `.env.example` files.
   - Configure your `MONGODB_URI` and `JWT_SECRET` in `server/.env`.

4. **Run the Application**:
   ```bash
   # Run Backend (from /server)
   npm run dev

   # Run Frontend (from /client)
   npm run dev
   ```

## 🚢 Deployment

For detailed instructions on deploying to **Vercel** (Frontend) and **Render** (Backend), please refer to the [Deployment Guide](DEPLOYMENT_GUIDE.md).

## 📄 License

This project is licensed under the [MIT License](LICENSE).

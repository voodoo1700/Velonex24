require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const shipments = await mongoose.connection.collection('shipments').find({}).toArray();
  console.log(`Found ${shipments.length} shipments`);
  if (shipments.length > 0) {
    console.log('First shipment:', shipments[0]);
  }
  
  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log(`Found ${users.length} users`);
  if (users.length > 0) {
    console.log('Admin user:', users.find(u => u.role === 'admin'));
  }
  
  process.exit(0);
}
checkData().catch(console.error);

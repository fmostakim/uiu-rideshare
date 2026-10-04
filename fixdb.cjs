const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://simunislam2_db_user:hCbM2JAI24b6iGYI@cluster0.z6eiawk.mongodb.net/uiu-rideshare?appName=Cluster0';
(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('uiu_rideshare');
  
  const idStr = '6ac115573d4e0119a7f63eb7';
  await db.collection('rides').updateOne(
    { _id: new ObjectId(idStr) },
    { $set: { seatsAvailable: 2 } }
  );
  
  await db.collection('trips').deleteMany({ rideId: idStr });
  
  console.log('Restored');
  client.close();
})();

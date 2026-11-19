import { MongoClient } from 'mongodb';

async function sync() {
  const uri = 'mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness?retryWrites=true&w=majority';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('placement_readiness');
  const profiles = await db.collection('profiles').find({}).toArray();
  let count = 0;
  for (const prof of profiles) {
    const uid = prof.userId || prof.id;
    const latestScore = await db.collection('readiness_scores').find({ userId: uid }).sort({ calculatedAt: -1 }).limit(1).toArray();
    if (latestScore.length > 0) {
      const s = latestScore[0];
      await db.collection('profiles').updateOne(
        { _id: prof._id },
        { $set: { readinessScore: s.primaryScore, readinessStatus: s.status, tierScores: s.tierScores, pillars: s.pillars } }
      );
      count++;
    }
  }
  console.log(`Successfully synced ${count} profiles with readiness scores!`);
  await client.close();
}

sync().catch(console.error);

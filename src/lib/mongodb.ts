import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/al_insaf_hospital';
const dbName = process.env.MONGODB_DB || 'al_insaf_hospital';

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: GlobalWithMongo;

let client: MongoClient;

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 4000,
  socketTimeoutMS: 30000,
};

/**
 * ============================================================================
 * মঙ্গোডিবি ক্লায়েন্ট কানেকশন ও ক্যাশিং (MongoDB Client Connection & Caching)
 * ============================================================================
 * Next.js-এর সার্ভারলেস (Serverless) ফাংশন প্রতি রিকোয়েস্টে নতুন করে রান হতে পারে।
 * বারবার কানেকশন খোলা ও বন্ধ করা ঠেকাতে `global._mongoClientPromise` ব্যবহার করে
 * কানেকশন ক্যাশ বা পুলিং (Connection Pooling) করা হয়।
 */
export async function getConnectedClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  try {
    return await global._mongoClientPromise;
  } catch (err) {
    // কোনো কারণে কানেকশন ফেইল করলে ক্যাশ রিসেট করা হয় যাতে পরের বার পুনরায় চেষ্টা করতে পারে
    global._mongoClientPromise = undefined;
    throw err;
  }
}

/**
 * সরাসরি ডাটাবেজ ইন্সট্যান্স রিটার্ন করার হেল্পার
 * এটি Vercel বা লোকাল সার্ভারে নিরাপদে ডেটাবেজের রেফারেন্স দেয়
 */
export async function getDatabase(): Promise<Db> {
  try {
    const connectedClient = await getConnectedClient();
    return connectedClient.db(dbName);
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error?.message || error);
    throw new Error('Database connection failed. Please ensure MongoDB service is running and MONGODB_URI is set correctly.');
  }
}

/**
 * নির্দিষ্ট কালেকশন অ্যাক্সেস করার ফাংশন (Generic Type সহ)
 * উদাহরণ: const doctorsCol = await getCollection<Doctor>('doctors');
 */
export async function getCollection<T extends Record<string, any>>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Diagnostics helper to verify MongoDB connection and collection counts
 */
export async function checkMongoConnection(): Promise<{
  connected: boolean;
  database: string;
  uriMasked: string;
  counts?: {
    users: number;
    doctors: number;
    appointments: number;
    inquiries: number;
  };
  error?: string;
}> {
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    const [users, doctors, appointments, inquiries] = await Promise.all([
      db.collection('users').countDocuments().catch(() => 0),
      db.collection('doctors').countDocuments().catch(() => 0),
      db.collection('appointments').countDocuments().catch(() => 0),
      db.collection('inquiries').countDocuments().catch(() => 0),
    ]);

    return {
      connected: true,
      database: dbName,
      uriMasked: maskedUri,
      counts: { users, doctors, appointments, inquiries },
    };
  } catch (err: any) {
    return {
      connected: false,
      database: dbName,
      uriMasked: maskedUri,
      error: err?.message || 'Cannot connect to MongoDB server.',
    };
  }
}

export default getConnectedClient;

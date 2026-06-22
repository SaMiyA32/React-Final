const { MongoClient } = require('mongodb');
const dns = require('dns');

// Override DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('DNS resolvers overridden');
} catch (e) {
    console.warn('Could not override DNS:', e);
}

const uri = "mongodb+srv://nc_computers_react:Sasmithapasan%40123@cluster0.1pzgrc8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Success! Connected successfully to MongoDB Atlas!");
  } catch (e) {
    console.error("❌ Connection failed:", e.message || e);
  } finally {
    await client.close();
  }
}
run();

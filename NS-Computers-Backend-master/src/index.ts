// index.ts
import dns from 'dns';

// Override Node DNS resolvers to Google DNS to fix querySrv ECONNREFUSED in Sri Lanka/local ISPs
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('🔮 Node DNS resolvers overridden to Google DNS [8.8.8.8, 8.8.4.4]');
} catch (e) {
    console.warn('⚠️ Could not override DNS servers:', e);
}

import app, { startServer } from "./app";

// Start the server with database connection
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
export default defineEventHandler(async () => {
  let directusStatus = 'unknown';
  let directusError = null;
  
  try {
    const directusUrl = process.env.DIRECTUS_URL || 'http://directus:8055';
    const response = await $fetch(`${directusUrl}/server/info`);
    directusStatus = 'connected';
  } catch (error: any) {
    directusStatus = 'error';
    directusError = error.message;
  }

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      nuxt: 'running',
      directus: {
        status: directusStatus,
        error: directusError
      }
    }
  };
});
// middleware/restrictToSameHost.js
const restrictToSameHost = (req, res, next) => {
    const allowedPath = `/collections/${req.params.collectionId}/images`; // Open endpoint
    const origin = req.get('Origin') || req.get('Referer') || '';

    // Allow open access for the specific endpoint
    if (req.path === allowedPath) {
        return next();
    }

    // Check if the Origin or Referer matches the server's base URL
    const serverHost = `${req.protocol}://${req.get('Host')}`;
    if (origin.startsWith(serverHost)) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden: Access restricted to same host' });
};

module.exports = restrictToSameHost;

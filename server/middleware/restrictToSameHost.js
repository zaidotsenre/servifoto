const restrictToSameHost = (req, res, next) => {
    const allowedPath = `/collections/${req.params?.collectionId}/images`; // Open endpoint
    const origin = req.get('Origin') || req.get('Referer') || '';
    const serverHost = `${req.protocol}://${req.get('Host')}`;
    
    // Allow open access for the specific endpoint
    if (req.path === allowedPath) {
        return next();
    }

    // Allow requests proxied through Apache
    const allowedHosts = [
        'http://servifoto.ernestodiaz.dev',
        'https://servifoto.ernestodiaz.dev',
        serverHost, // Backend server
    ];

    if (allowedHosts.some(allowedHost => origin.startsWith(allowedHost))) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden: Access restricted to same host' });
};

module.exports = restrictToSameHost;

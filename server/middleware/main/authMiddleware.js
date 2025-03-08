const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // If user is already logged in and visits /login, redirect to /me
        if (req.path === '/login') {
            return res.redirect('/me');
        }

        next();
    } catch (err) {
        // Remove the invalid token
        res.clearCookie('token');

        // Redirect to login page
        return res.redirect('/login');
    }
};

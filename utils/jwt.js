import jwt from 'jsonwebtoken'

const jwtKey = "walletbackend2002"

export function sign(payload) {
    return jwt.sign(payload, jwtKey, { expiresIn: "1d" });
}

export function verify(token) {
    try {
        return jwt.verify(token, jwtKey);
    } catch(error) {
        return false;
    }
}

export function decode(token) {
    return jwt.decode(token, { complete: true });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

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

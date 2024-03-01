import { User } from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users);
    } catch (error) {}
};

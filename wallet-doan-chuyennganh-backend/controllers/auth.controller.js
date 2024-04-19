import { User } from "../models/User.js";
import { sign } from "../utils/jwt.js";
import bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import { generateUniqueHash, getTimestampPlus30Minutes, sendEmail } from "../utils/send-email.js";
import { Account } from '../models/Account.js'
import { ethers } from 'ethers'


export const login = async (req, res) => {
    try {
        let {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "BadRequest: Email and password are required" });
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({ error: "BadRequest: Not find user with email = " + email });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        const isTempPasswordMatch = user.temporary_password == password && user.temporary_password_expired > Date.now();
        if (isPasswordMatch || isTempPasswordMatch) {
            // login success
            let token = sign({id: user.id});
            return res.status(200).json({
                token: token
            })
        } else {
            return res.status(400).json({ error: "BadRequest: Password not correct for email = " + email });
        }

    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Error finding user" });
    }
};

export const signin = async (req, res) => {
    try {
        let {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "BadRequest: Email and password are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "BadRequest: Invalid email format" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "BadRequest: Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {email: email, password: hashedPassword};

        const userModel = await User.create(newUser);

        // add account start

        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        let new_account = {
            name: "Account " + address.slice(2, 8),
            privateKey: privateKey,
            address: address,
            user_id: userModel.id
        }

        console.log("new_account ", new_account);

        let created_account = await Account.create(new_account);
        
        // add account end
        
        return res.status(201).json({message: "User created"});
    } catch (error) {
        if (error instanceof UniqueConstraintError && error.errors[0].path === 'email') {
            console.log('Email is already in use');
            return res.status(400).json({ error: "BadRequest: Email is already in use" });
        }

        res.status(400).json({ error: "BadRequest: Cannot signin account" });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body

        if (!email) {
            return res.status(400).json({ error: "BadRequest: Email are required" });
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({ error: "BadRequest: Not find user with email = " + email });
        }

        const temp_password = generateUniqueHash();

        user.temporary_password = temp_password;
        user.temporary_password_expired = getTimestampPlus30Minutes();

        await user.save(); 

        await sendEmail(user.email, "U2MYA blockchain wallet, forgot password", `Temporary password is ${temp_password}, please login with temporary password and change password 30 minutes before`);

        return res.status(200).json({ message: "Temporary password sent successfully" });
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Cannot send temporary password"});
    }
}

export const changePassword  = async (req, res) => {
    try {
        let {newPassword} = req.body;
        let userRequest = req.user

        if (!newPassword) {
            return res.status(400).json({ error: "BadRequest: newPassword are required" });
        }

        const user = await User.findOne({
            where: {
                id: userRequest.id
            }
        });

        if (!user) {
            return res.status(400).json({ error: "BadRequest: Not find user with email = " + email });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        console.log("bf save", user);

        await user.save();
        console.log("save");

        return res.status(200).json({
            message: "Change password successfully"
        })
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Cannot change password"});
    }
}
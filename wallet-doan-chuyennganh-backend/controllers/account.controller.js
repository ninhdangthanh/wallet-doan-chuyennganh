import { ethers } from 'ethers'

import { Account } from '../models/Account.js'

export const createAccount = async (req, res) => {
    try {
        let user_id = req.user.id;
        
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        let new_account = {
            name: "Account " + address.slice(2, 8),
            privateKey: privateKey,
            address: address,
            user_id: user_id
        }

        let created_account = await Account.create(new_account);

        return res.status(201).json({account: created_account})
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not create new account, err=" + error});
    }
}

export const removeAccount = async (req, res) => {
    try {
        let user_id = req.user.id;
        let account_id = req.params.id;

        const account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        if (!account) {
            return res.status(404).json({ error: "Not found: Account not found"});
        }
        
        await account.destroy();

        return res.status(200).json({message: 'Success: Account removed successfully'})
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not removed account, err=" + error});
    }
}

export const changeNameAccount = async (req, res) => {
    try {
        let user_id = req.user.id;
        let account_id = req.params.id;
        let new_name = req.body.name;

        if (new_name.length < 6) {
            return res.status(400).json({ error: "BadRequest: new name must greater than 6 character"});
        }

        const account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        if (!account) {
            return res.status(404).json({ error: "Not found: Account not found"});
        }

        account.name = new_name;

        await account.save();

        return res.status(200).json({ message: "Success: change name account success"});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not change name account, err=" + error});
    }
} 

export const addAccount = async (req, res) => {
    try {
        let user_id = req.user.id;
        let account_private_key = req.body.account_private_key;
        
        if (!(account_private_key.length == 66 && account_private_key.slice(0, 2) == "0x")) {
            return res.status(400).json({ error: "BadRequest: Private key is incorrect format"});
        }

        const wallet = new ethers.Wallet(account_private_key);

        console.log(wallet.address);

        let account = {
            name: "Account " + wallet.address.slice(2, 8),
            privateKey: account_private_key,
            address: wallet.address,
            user_id: user_id
        }

        await Account.create(account);

        return res.status(201).json({message: "Success: account is added"})
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not add account, err=" + error});
    }
} 
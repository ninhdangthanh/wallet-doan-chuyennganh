import { ethers } from 'ethers'

import { Account } from '../models/Account.js'
import { system_config } from '../config.js';




const provider = new ethers.providers.JsonRpcProvider(system_config.account_balance_query_provider_rpc);


export const getAccountOfUser = async (req, res) => {
    try {
        let user_id = req.user.id;
        
        const accounts = await Account.findAll({
            where: {
                user_id: user_id
            }
        });

        // if (accounts) {
        //     accounts.forEach(item => {
        //         item.privateKey = ""
        //     });
        // }

        const formattedAccounts = accounts.map(account => ({
            ...account.toJSON(), 
            balance: formatEthBalance(account.balance)
        }));

        return res.status(200).json(formattedAccounts)
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not get account of user, err=" + error});
    }
}

export const createAccount = async (req, res) => {
    try {
        let user_id = req.user.id;
        let account_name = req.body.name;
        
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        // todo: 1 user have maximum 6 account

        let new_account = {
            name: account_name,
            privateKey: privateKey,
            address: address,
            user_id: user_id,
            balance: "0.000"
        }

        let created_account = await Account.create(new_account);

        return res.status(201).json(created_account)
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
        let new_name = req.body.name;
        
        if (!(account_private_key.length == 66 && account_private_key.slice(0, 2) == "0x")) {
            return res.status(400).json({ error: "BadRequest: Private key is incorrect format"});
        }

        const wallet = new ethers.Wallet(account_private_key);

        console.log(wallet.address);
        const balance = await provider.getBalance(wallet.address);
        
        const formattedBalance = formatEthBalance(ethers.utils.formatEther(balance));

        let account = {
            name: new_name,
            privateKey: account_private_key,
            address: wallet.address,
            user_id: user_id,
            balance: formattedBalance
        }

        let accountImported = await Account.create(account);

        return res.status(201).json(accountImported)
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not add account, err=" + error});
    }
} 

export function formatEthBalance(balance) {
    const numBalance = typeof balance === "string" ? parseFloat(balance) : balance;
    return numBalance.toFixed(3);
  }
  
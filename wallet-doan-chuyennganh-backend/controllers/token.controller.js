import { Account } from "../models/Account.js"
import { erc20_abi } from "../abis/erc20.js"
import { ERC20 } from "../models/ERC20.js"
import { ethers } from "ethers"

export const importTokenERC20 = async (req, res) => {
    const user_id = req.user.id
    const {account_id, token_address} = req.body

    if(account_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Account_id id must greater than 0"});
    }
    if(token_address.length != 42 && token_address.slice(0, 2) != '0x') {
        return res.status(400).json({ error: "BadRequest: token_address id must is a blockchain address"});
    }

    try {
        let account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
        const tokenContract = new ethers.Contract(token_address, erc20_abi, provider);

        const name = await tokenContract.name();
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        // console.log(name, decimals, symbol);

        const new_erc20_token = {
            name: name,
            contract_address: token_address,
            symbol: symbol,
            decimal: decimals,
            account_id: account.id,
            network_id: 1
        }

        // console.log(new_erc20_token);

        let created_token = await ERC20.create(new_erc20_token);
        
        return res.status(200).json({ message: "Import token erc20 succes", data:  created_token});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to add token to account, err=" + error});
    }
}

export const removeTokenERC20 = async (req, res) => {
    try {
        const account_id = req.params.account_id
        const token_erc20_id = req.params.id;

        let token_erc20 = await ERC20.findOne({
            where: {
                id: token_erc20_id,
                account_id: account_id
            }
        });

        await token_erc20.destroy();
        
        return res.status(200).json({ message: "Remove token erc20 success"});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to remove token erc20, err=" + error});
    }
}

export const getTokenERC20s = async (req, res) => {
    try {
        const {account_id} = req.params;

        let token_erc20s = await ERC20.findAll({
            where: {
                account_id: account_id
            }
        });

        return res.status(200).json(token_erc20s);
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to remove token erc20, err=" + error});
    }
}

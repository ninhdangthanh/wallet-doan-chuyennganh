import { Network } from "../models/Network.js"
import { Account } from "../models/Account.js"
import { erc20_abi } from "../abis/erc20.js"
import { erc721_abi } from "../abis/erc721.js"
import { ERC20 } from "../models/ERC20.js"
import { ethers } from "ethers"

export const importTokenERC20 = async (req, res) => {
    const user_id = 4 //req.user.id
    const {network_id, account_id, token_address} = req.body

    if(network_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Network id must greater than 0"});
    }
    if(account_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Account_id id must greater than 0"});
    }
    if(token_address.length != 42 && token_address.slice(0, 2) != '0x') {
        return res.status(400).json({ error: "BadRequest: token_address id must is a blockchain address"});
    }

    try {
        let network = await Network.findOne({
            where: {
                id: network_id,
                // user_id: user_id
            }
        });
        let account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
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
            network_id: network_id
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
        const {network_id, account_id} = req.params;

        let token_erc20s = await ERC20.findAll({
            where: {
                network_id: network_id,
                account_id: account_id
            }
        });

        return res.status(200).json(token_erc20s);
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to remove token erc20, err=" + error});
    }
}


export const importTokenERC721 = async (req, res) => {
    try {
        const user_id = 4// req.user.id
        const account_id = 25;
        const token_id = 1;
        const address_token = "0x84f94f9EA02b59f60b498A47bb67753372db7e3f"
        const network_id = 10

        let network = await Network.findOne({
            where: {
                id: network_id,
                // user_id: user_id
            }
        });
        let account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
        const tokenContract = new ethers.Contract(address_token, erc721_abi, provider);

        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const tokenOwner = await tokenContract.ownerOf(token_id)
        const isOwner = tokenOwner === account.address
        
        if (!isOwner) {
            return res.status(400).json({ error: "BadRequest: NFT is not belong this account"});
        }

        return res.status(200).json({name, symbol, tokenOwner, address: account.address, isOwner});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to import NFT, err=" + error});
    }
}

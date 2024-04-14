import { Network } from "../models/Network.js"
import { Account } from "../models/Account.js"
import { erc20_abi } from "../abis/erc20.js"
import { erc721_abi } from "../abis/erc721.js"
import { ERC20 } from "../models/ERC20.js"
import { ethers } from "ethers"
import { ERC721 } from "../models/ERC721.js"

export const importTokenERC20 = async (req, res) => {
    const user_id = req.user.id
    const {network_id, account_id, token_address} = req.body

    // if(network_id <= 0) {
    //     return res.status(400).json({ error: "BadRequest: Network id must greater than 0"});
    // }
    if(account_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Account_id id must greater than 0"});
    }
    if(token_address.length != 42 && token_address.slice(0, 2) != '0x') {
        return res.status(400).json({ error: "BadRequest: token_address id must is a blockchain address"});
    }

    try {
        // let network = await Network.findOne({
        //     where: {
        //         id: network_id,
        //         // user_id: user_id
        //     }
        // });
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
        const { account_id, token_id, address_token, network_id } = req.body;

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

        const tokenOwner = await tokenContract.ownerOf(token_id)
        const isOwner = tokenOwner === account.address
        
        if (!isOwner) {
            return res.status(400).json({ error: "BadRequest: NFT is not belong this account"});
        }

        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();

        const new_token_erc721 = {
            name: name,
            contract_address: address_token,
            token_id: token_id,
            symbol: symbol,
            account_id: account_id,
            network_id: network_id
        }

        let created_token = await ERC721.create(new_token_erc721);
        
        return res.status(200).json({ message: "Import NFT succes", data:  created_token});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to import NFT, err=" + error});
    }
}

export const removeNFT = async (req, res) => {
    try {
        const user_id = 4  // req.user.id
        const { account_id, nft_id } = req.params;

        let account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        if(!account) {
            return res.status(400).json({ error: "BadRequest: Account not belong user"});
        }

        let nft = await ERC721.findOne({
            where: {
                id: nft_id,
                account_id: account_id
            }
        });

        await nft.destroy()

        return res.status(200).json({ message: "Remove NFT success"});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Failed to delete NFT, error=" + error});
    }
}

export const getNFTofAccount = async (req, res) => {
    try {
        const user_id = 4  // req.user.id
        const { account_id } = req.params;

        let account = await Account.findOne({
            where: {
                id: account_id,
                user_id: user_id
            }
        });

        if(!account) {
            return res.status(400).json({ error: "BadRequest: Account not belong user"});
        }

        let NFTs = await ERC721.findAll({
            where: {
                account_id: account_id
            }
        });

        return res.status(200).json(NFTs);
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Failed to get NFT of account, error=" + error});
    }
}
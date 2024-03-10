import { ethers } from 'ethers'

import { Network } from '../models/Network.js'

// {
//     name
    // rpc_url
    // chain_id
    // currency_symbol
    // block_explorer_url
// }
export const createNetwork = async (req, res) => {
    try {
        let user_id = req.user.id;

        const provider = new ethers.providers.JsonRpcProvider(req.body.rpc_url);

        const network = await provider.getNetwork();
        
        const new_network = {
            name: network.name,
            rpc_url: req.body.rpc_url,
            chain_id: network.chainId,
            currency_symbol: req.body.currency_symbol,
            block_explorer_url: req.body.block_explorer_url,
            is_default: false,
            user_id: user_id
        }

        let network_created = await Network.create(new_network); 

        return res.status(201).json({network: network_created})
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not create new network, err=" + error});
    }
}

export const removeNetwork = async (req, res) => {
    try {
        let user_id = req.user.id;
        let network_id = req.params.id;

        const network = await Network.findOne({
            where: {
                id: network_id,
                user_id: user_id
            }
        });

        if (!network) {
            return res.status(404).json({ error: "Not found: Network not found"});
        }
        
        await network.destroy();

        return res.status(200).json({message: 'Success: Network removed successfully'})
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Can not removed network, err=" + error});
    }
}

export const getNetworkOfUser = async (req, res) => {
    try {
        let user_id = req.user.id;

        console.log("user_id", user_id);
        
        const networks = await Network.findAll({
            $or: [
                {user_id: {
                    $eq: user_id
                }},
                {is_default: {
                    $eq: true
                }}
            ]
        });

        return res.status(200).json(networks)
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: failed to get network, err=" + error});
    }
}

function validateURL(url) {
    var pattern = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/[^\s]*)?$/;
    return pattern.test(url);
}
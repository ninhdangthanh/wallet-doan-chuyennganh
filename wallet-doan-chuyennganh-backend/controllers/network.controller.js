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

        if (!validateURL(req.body.rpc_url)) {
            return res.status(400).json({ error: "BadRequest: rpc_url must be a url"});
        }
        if (req.body.block_explorer_url && !validateURL(req.body.block_explorer_url)) {
            return res.status(400).json({ error: "BadRequest: block_explorer_url must be a url"});
        }
        if (req.body.name.length <= 3) {
            return res.status(400).json({ error: "BadRequest: network name must greater than 3 character"});
        }
        if (req.body.chain_id <= 1) {
            return res.status(400).json({ error: "BadRequest: network chain_id must greater than 1"});
        }
        if (req.body.currency_symbol && req.body.currency_symbol.length <= 3) {
            return res.status(400).json({ error: "BadRequest: network name must greater than 3 character"});
        }
        
        const new_network = {
            name: req.body.name,
            rpc_url: req.body.rpc_url,
            chain_id: req.body.chain_id,
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

function validateURL(url) {
    var pattern = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/[^\s]*)?$/;
    return pattern.test(url);
}
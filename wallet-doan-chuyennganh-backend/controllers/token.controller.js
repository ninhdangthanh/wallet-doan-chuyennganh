import { Account } from "../models/Account.js";
import { Activity } from "../models/Activity.js";
import { Network } from "../models/Network.js";
import { ethers } from "ethers"


export const sendCoin = async (req, res) => {
    const user_id = 4; // req.user.id
    // const {network_id, account_id, to_addr, value} = req.body
    let network_id = 10 // sepolia
    let account_id = 25 // account 20
    let to_addr = '0x12f75c70230aFB9Bd4B322aFd971793227b450f4'
    let amount = 0.1;

    if(network_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Network id must greater than 0"});
    }
    if(amount <= 0) {
        return res.status(400).json({ error: "BadRequest: Amount id must greater than 0"});
    }
    if(account_id <= 0) {
        return res.status(400).json({ error: "BadRequest: Account_id id must greater than 0"});
    }
    if(to_addr.length != 42 && to_addr.slice(0, 2) != '0x') {
        return res.status(400).json({ error: "BadRequest: to_addr id must is a blockchain address"});
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

        try {
            const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
            const wallet = new ethers.Wallet(account.privateKey, provider);
            const amountToSend = ethers.utils.parseEther(`${amount}`);

            const tx_res = await wallet.sendTransaction({
                to: to_addr,
                value: amountToSend
            });

            // create history pending
            let history_pending = {
                tx_hash: tx_res.hash,
                from: account.address,
                to: to_addr,
                amount: `${amount}`,
                nonce: tx_res.nonce,
                network_id: network.id,
                chain_rpc: network.rpc_url,
                chain_id: network.chain_id,
                chain_name: network.name,
                status: 'PENDING',
                account_id: account.id,
                user_id: user_id,
            }

            await Activity.create(history_pending); 

            // console.log(JSON.stringify(data));
            return res.status(200).json({ message: "Pending: Transaction is requested to blockchain"});
        } catch (error) {
            let history_failed = {
                network_id: network_id,
                to: to_addr,
                amount: `${amount}`,
                status: 'PENDING',
                account_id: account_id,
                user_id: user_id,
            }
    
            await Activity.create(history_failed); 
    
            return res.status(400).json({ error: "BadRequest: Send coin failed, err=" + error});
        }
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Send coin failed, err=" + error});
    }
}


// if greater or equal 2 block confirm, transaction success
export const transaction_query_loop = () => {
    setInterval(async () => {
        let transactions = await Activity.findAll({
            where: {
                status: 'PENDING'
            }
        });
        if(transactions && transactions.length > 0) {
            transactions.forEach(async (tx) => {
                const provider = new ethers.providers.JsonRpcProvider(tx.chain_rpc);
                const tx_detail = await provider.getTransaction(tx.tx_hash)
                if (tx_detail.confirmations) {
                    tx.status = 'SUCCESS'
                    await tx.save()
                }
            });
        }
    }, 5000);
}
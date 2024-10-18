import { ethers } from "ethers"
import { Account } from '../models/Account.js'
import { system_config } from "../config.js";
import { TxsAnalytics } from "../models/TransactionAnalytics.js";


const provider = new ethers.providers.JsonRpcProvider(system_config.txs_query_provider_rpc);

export const getTxsDetail = async (req, res) => {
    try {
        const latestBlockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(latestBlockNumber);
        
        if (!block) {
            return res.status(404).json({ message: "Block not found" });
        }

        console.log(latestBlockNumber, " block ", );
        

        for (let i = 0; i < 10; i++) {
            const tx = block.transactions[i];
            console.log(tx);
            
            const txReceipt = await provider.getTransactionReceipt(tx);

            const balance = await provider.getBalance(tx);

            await TxsAnalytics.create({
                tx_hash: tx.hash,
                balance: ethers.utils.formatEther(balance),
                gas: txReceipt.gasUsed.toString(),
                block_number: block.number.toString(),
            });
        }

        await TxsAnalytics.destroy({
            where: {
                block_number: (latestBlockNumber - 10).toString(),
            },
        });

        res.status(200).json({ message: "Transactions saved to database" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving block information" });
    }
}



export const getTxsByBlockNumber = async (req, res) => {
    try {
        const blockNumber = req.params.blockNumber;

        const transactions = await TxsAnalytics.findAll({
            where: {
                block_number: blockNumber,
            },
        });

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this block number" });
        }

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving transactions" });
    }
}
import { ethers } from "ethers"
import { system_config } from "../config.js";
import { TxsAnalytics } from "../models/TransactionAnalytics.js";
import { LatestBlockInfo } from "../models/LatestBlockInfo.js";


export const getLatesBlockNumber = async (req, res) => {
    try {
        const latestRecords = await TxsAnalytics.findAll({
            limit : system_config.latest_txs_quantity_to_save,
            order: [
                ['id', 'DESC'],
            ],
        })

        if (latestRecords) {
            res.status(200).json(latestRecords[0].block_number);
        } else {
            res.status(404).json({ message: "Not found latest block number" });
        }
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


export const getLatesBlockInfo = async (req, res) => {
    try {
        const blockInfo = await LatestBlockInfo.findAll({});

        res.status(200).json(blockInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving blockInfo" });
    }
}

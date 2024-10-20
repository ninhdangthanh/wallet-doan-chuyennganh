import { ethers } from 'ethers';
import { Account } from "./models/Account.js";
import { TxsAnalytics } from "./models/TransactionAnalytics.js";
import { system_config } from "./config.js";
import { Op } from 'sequelize';
import { LatestBlockInfo } from './models/LatestBlockInfo.js';

export async function query_txs_of_block () {
    try {
        console.log("--- start query latest block txs ---");
        
        const provider = new ethers.providers.JsonRpcProvider(system_config.txs_query_provider_rpc);
        
        const latestBlockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(latestBlockNumber);
        
        if (!block) {
            return res.status(404).json({ message: "Block not found" });
        }

        let blockNumber = block.number.toString();

        // start: storage latest block info
        const blockMinedAt = new Date(block.timestamp * 1000);
        const txCount = block.transactions.length;

        const storage_latest_block = {
            block_number: block.number,
            miner: block.miner,
            gas_used: block.gasUsed.toString(),
            transaction_count: txCount,
            block_mined_at: blockMinedAt.toLocaleString(),
            time_between_blocks: system_config.time_between_block
        }

        await LatestBlockInfo.destroy({
            where: {},
        });
        await LatestBlockInfo.create(storage_latest_block)
        // end: storage latest block info
        
        // storage transactions
        for (let i = 0; i < system_config.latest_txs_quantity_to_save; i++) {
            const tx = block.transactions[i];
            
            const txReceipt = await provider.getTransactionReceipt(tx);
            const txDetail = await provider.getTransaction(tx);
            // console.log("tx: ", tx, " --- ", "Gas Used:", txReceipt.gasUsed.toString(), "  ------  Transfer Balances:", txDetail.value.toString());
            
            await TxsAnalytics.create({
                tx_hash: tx,
                balance: txDetail.value.toString(),
                gas: txReceipt.gasUsed.toString(),
                block_number: blockNumber,
            })
        }

        // await TxsAnalytics.create(txs_storage);

        await TxsAnalytics.destroy({
            where: {
                block_number: {
                    [Op.lte]: (latestBlockNumber - 10).toString(),
                },
            },
        });

        console.log("--- end query latest block txs ---");

    } catch (error) {
        console.error(error);
    }
}


export async function query_account_balance() {
    const provider = new ethers.providers.JsonRpcProvider(system_config.account_balance_query_provider_rpc); // Replace with your provider
    
    try {
        let accounts = await Account.findAll();
        console.log("--- start query to update account balances ---");
        
        for (const account of accounts) {
            const address = account.address;
            const currentBalance = await provider.getBalance(address);
            const balanceInEth = ethers.utils.formatEther(currentBalance);
            

            if (parseFloat(balanceInEth) !== account.balance) {
                account.balance = parseFloat(balanceInEth);
                await account.save();
                // console.log(`Updated balance for ${address}: ${balanceInEth} ETH`);
            } else {
                // console.log(`Balance for ${address} is unchanged: ${balanceInEth} ETH`);
            }
        }

        console.log("--- finish query to update account balances ---");
    } catch (error) {
        
    }
}


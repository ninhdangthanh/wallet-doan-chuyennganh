import { ethers } from 'ethers';
import { Account } from "./models/Account.js";
import { TxsAnalytics } from "./models/TransactionAnalytics.js";
import { system_config } from "./config.js";
import { Op } from 'sequelize';
import { LatestBlockInfo } from './models/LatestBlockInfo.js';
import { ERC20 } from './models/ERC20.js';
import { Activity } from './models/Activity.js';

// export async function query_txs_of_block () {
//     try {
//         console.log("--- start query latest block txs ---");
        
//         const provider = new ethers.providers.JsonRpcProvider(system_config.txs_query_provider_rpc);
        
//         const latestBlockNumber = await provider.getBlockNumber();
//         const block = await provider.getBlock(latestBlockNumber);
        
//         if (!block) {
//             return res.status(404).json({ message: "Block not found" });
//         }

//         let blockNumber = block.number.toString();

//         // start: storage latest block info
//         const blockMinedAt = new Date(block.timestamp * 1000);
//         const txCount = block.transactions.length;

//         const storage_latest_block = {
//             block_number: block.number,
//             miner: block.miner,
//             gas_used: block.gasUsed.toString(),
//             transaction_count: txCount,
//             block_mined_at: blockMinedAt.toLocaleString(),
//             time_between_blocks: system_config.time_between_block
//         }

//         await LatestBlockInfo.destroy({
//             where: {},
//         });
//         await LatestBlockInfo.create(storage_latest_block)
//         // end: storage latest block info
        
//         // storage transactions
//         for (let i = 0; i < system_config.latest_txs_quantity_to_save; i++) {
//             const tx = block.transactions[i];
            
//             const txReceipt = await provider.getTransactionReceipt(tx);
//             const txDetail = await provider.getTransaction(tx);
//             // console.log("tx: ", tx, " --- ", "Gas Used:", txReceipt.gasUsed.toString(), "  ------  Transfer Balances:", txDetail.value.toString());
            
//             await TxsAnalytics.create({
//                 tx_hash: tx,
//                 balance: txDetail.value.toString(),
//                 gas: txReceipt.gasUsed.toString(),
//                 block_number: blockNumber,
//             })
//         }

//         // await TxsAnalytics.create(txs_storage);

//         await TxsAnalytics.destroy({
//             where: {
//                 block_number: {
//                     [Op.lte]: (latestBlockNumber - 50).toString(),
//                 },
//             },
//         });

//         console.log("--- end query latest block txs ---");

//     } catch (error) {
//         console.error(error);
//     }
// }


export async function query_account_balance() {
    const provider = new ethers.providers.JsonRpcProvider(system_config.account_balance_query_provider_rpc); // Replace with your provider
    
    try {
        let accounts = await Account.findAll();
        console.log("--- start query to update account balances ---");
        
        for (const account of accounts) {
            const address = account.address;
            const currentBalance = await provider.getBalance(address);
            const balanceInEth = ethers.utils.formatEther(currentBalance);
            

            if (formatEthBalance(balanceInEth) !== account.balance) {
                account.balance = formatEthBalance(balanceInEth);
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


const ERC20_ABI_BALANCE = [
    "function balanceOf(address account) view returns (uint256)"
];

export async function query_erc20_balance() {
    const provider = new ethers.providers.JsonRpcProvider(system_config.account_balance_query_provider_rpc);
    
    try {
        let erc20Tokens = await ERC20.findAll();
        console.log("--- start query to update ERC20 token balances ---");

        for (const token of erc20Tokens) {
            const { contract_address, account_id, decimal } = token;
            
            const account = await Account.findByPk(account_id);
            if (!account) {
                console.log(`Account not found for ERC20 token ID ${token.id}`);
                continue;
            }

            const contract = new ethers.Contract(contract_address, ERC20_ABI_BALANCE, provider);
            const balance = await contract.balanceOf(account.address);
            
            const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, decimal));
            
            if (formattedBalance !== token.balance) {
                token.balance = formattedBalance;
                await token.save();
                console.log(`Updated balance for token ${token.symbol} in account ${account.address}: ${formattedBalance}`);
            } else {
                console.log(`Balance for token ${token.symbol} in account ${account.address} is unchanged: ${formattedBalance}`);
            }
        }

        console.log("--- finish query to update ERC20 token balances ---");
    } catch (error) {
        console.error("Error querying ERC20 token balance:", error);
    }
}


export async function query_pending_activities() {
    const provider = new ethers.providers.JsonRpcProvider(system_config.query_txs_status_rpc);

    try {
        console.log("--- Start querying pending activities ---");
        
        const pendingActivities = await Activity.findAll({
            where: { status: "PENDING" }
        });
        
        for (const activity of pendingActivities) {
            const txHash = activity.tx_hash;
            
            try {
                const receipt = await provider.getTransactionReceipt(txHash);
                
                if (receipt) {
                    if (receipt.status === 1) {
                        activity.status = "SUCCESS";
                    } else {
                        activity.status = "FAILED";
                    }
                    await activity.save();
                    console.log(`Updated status for tx ${txHash}: ${activity.status}`);
                } else {
                    console.log(`Transaction ${txHash} is still pending`);
                }
            } catch (txError) {
                console.error(`Error fetching transaction ${txHash}:`, txError);
            }
        }

        console.log("--- Finished querying pending activities ---");
    } catch (error) {
        console.error("Error querying pending activities:", error);
    }
}

export function formatEthBalance(balance) {
    const numBalance = typeof balance === "string" ? parseFloat(balance) : balance;
    return numBalance.toFixed(3);
  }
  
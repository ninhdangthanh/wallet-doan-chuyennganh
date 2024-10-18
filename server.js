import app from "./app.js";
import { sequelize } from "./db/database.js";
import { ethers } from 'ethers';

import { Account } from "./models/Account.js";
import { User } from './models/User.js'
import { Activity } from './models/Activity.js'
import { ERC20 } from './models/ERC20.js'
import { TxsAnalytics } from "./models/TransactionAnalytics.js";
import { system_config } from "./config.js";


async function db_connect() {
    try {
        await sequelize.authenticate()
        // await User.sync({ force: true }) 
        // await Account.sync({ force: true })
        // await Activity.sync({ force: true })
        // await ERC20.sync({ force: true })
        // await TxsAnalytics.sync({ force: true })

        // await Account.bulkCreate([
        //     {
        //         name: 'Account 1',
        //         privateKey: 'private_key_1',
        //         address: '0xf499eB0da3A49eEc1ad1944a3045331A9bf6C57B',
        //         balance: 1000,  // Initial balance
        //         user_id: 1
        //     },
        //     {
        //         name: 'Account 2',
        //         privateKey: 'private_key_2',
        //         address: '0xEd899f12dc83c59eA830e0aA903c7684655E29be',
        //         balance: 1000,  // Initial balance
        //         user_id: 2
        //     }
        // ]);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function query_account_balance() {
    const provider = new ethers.providers.JsonRpcProvider(system_config.txs_query_provider_rpc); // Replace with your provider
    
    try {
        let accounts = await Account.findAll();
        console.log("start query");
        
        for (const account of accounts) {
            const address = account.address;
            const currentBalance = await provider.getBalance(address);
            const balanceInEth = ethers.utils.formatEther(currentBalance);
            

            if (parseFloat(balanceInEth) !== account.balance) {
                account.balance = parseFloat(balanceInEth);
                await account.save();
                console.log(`Updated balance for ${address}: ${balanceInEth} ETH`);
            } else {
                console.log(`Balance for ${address} is unchanged: ${balanceInEth} ETH`);
            }
        }
    } catch (error) {
        
    }
}

async function main() {
    const port = 5000;

    await db_connect();

    // setInterval(query_account_balance, system_config.txs_query_time);
    
    try {
        await sequelize.sync({ force: false });
        app.listen(port, () => {
            console.log(`\nServer is listening on port ${port}, http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}


main();
import app from "./app.js";
import { sequelize } from "./db/database.js";


import { Account } from "./models/Account.js";
import { User } from './models/User.js'
import { Activity } from './models/Activity.js'
import { ERC20 } from './models/ERC20.js'
import { TxsAnalytics } from "./models/TransactionAnalytics.js";
import { query_account_balance, query_erc20_balance, query_pending_activities, query_txs_of_block } from "./cronjobs.js";
import { system_config } from "./config.js";
import { LatestBlockInfo } from "./models/LatestBlockInfo.js";


async function db_connect() {
    try {
        await sequelize.authenticate()
        // await User.sync({ force: true }) 
        // await Account.sync({ force: true })
        // await Activity.sync({ force: true })
        // await ERC20.sync({ force: true })
        // await TxsAnalytics.sync({ force: true })
        // await LatestBlockInfo.sync({force: true})

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



async function main() {
    const port = 5000;

    await db_connect();

    // setInterval(query_account_balance, system_config.txs_query_time);
    
    // // await query_txs_of_block()
    // setInterval(query_txs_of_block, 6000);
    // setInterval(query_erc20_balance, 2000);
    // setInterval(query_pending_activities, 5000);
    
    
    
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
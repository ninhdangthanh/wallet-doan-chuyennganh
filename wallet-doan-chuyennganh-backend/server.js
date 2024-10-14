import app from "./app.js";
import { sequelize } from "./db/database.js";

import { Account } from "./models/Account.js";
import { User } from './models/User.js'
import { Activity } from './models/Activity.js'
import { ERC20 } from './models/ERC20.js'


async function db_connect() {
    try {
        // await sequelize.authenticate()
        // await User.sync({ force: true }) 
        // await Account.sync({ force: true })
        // await Activity.sync({ force: true })
        // await ERC20.sync({ force: true })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function main() {
    const port = 5000;

    await db_connect();
    
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
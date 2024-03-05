import app from "./app.js";
import { sequelize } from "./db/database.js";

import { Account } from "./models/Account.js";
import { User } from './models/User.js'
import { Network } from './models/Network.js'


async function db_connect() {
    try {
        await sequelize.authenticate()
        // await User.sync({ force: true }) 
        // await Account.sync({ force: true })
        // await Network.sync({ force: true })
    } catch (error) {
        console.error('Unable to connect to the database:', err);
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
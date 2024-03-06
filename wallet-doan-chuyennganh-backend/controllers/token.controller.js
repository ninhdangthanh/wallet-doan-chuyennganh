import { Account } from "../models/Account.js";
import { Network } from "../models/Network.js";
import { ethers } from "ethers"


export const sendCoin = async (req, res) => {
    try {
        const user_id = 4; // req.user.id
        // const {network_id, account_id, to_addr, value} = req.body
        let network_id = 10 // sepolia
        let account_id = 25 // account 20
        let to_addr = '0x12f75c70230aFB9Bd4B322aFd971793227b450f4'
        let amount = 0.1;

        // get network, get account
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

        // create history pending

        // send token 
        const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
        const wallet = new ethers.Wallet(account.privateKey, provider);
        const amountToSend = ethers.utils.parseEther(`${amount}`);

        const data = await wallet.sendTransaction({
            to: to_addr,
            value: amountToSend
        });

        // console.log(JSON.stringify(data));

        return res.status(200).json({ error: "Pending: transaction is requested to blockchain"});
    } catch (error) {
        return res.status(400).json({ error: "BadRequest: Send coin failed, err=" + error});
    }
}


// if greater or equal 2 block confirm, transaction success
export const transaction_query_loop = () => {
    let count = 0;
    setInterval(() => {
        // transactions = select * tx_history where status = pending
        let transactions = ['0xfcd081dd931b3d43e3d25a02eddf28ab4793f8b2bf5fa4e583eb73241229dffe', '0x76e1bdcf245ec864cdf2500e636af5db67fbfd35dc977ae0b445cd3ce72e7c8d']
        if(transactions && transactions.length > 0) {
            transactions.forEach(async (tx, index) => {
                const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
                const tx_detail = await provider.getTransaction(tx)
                if (tx_detail.confirmations) {
                    transactions = transactions.filter(item => item != tx)
                }
                console.log(index, tx, tx_detail.confirmations);
                // if tx_detail.confirmations >= 2 => update transaction history
            });
        }
        count ++;
        console.log("loop " + count);
    }, 5000);
}
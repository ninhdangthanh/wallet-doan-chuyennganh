import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Network = sequelize.define(
    "networks",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: 'network_name',
        },
        rpc_url: {
            type: DataTypes.STRING,
        },
        chain_id: {
            type: DataTypes.INTEGER,
        },
        currency_symbol: {
            type: DataTypes.STRING,
        },
        block_explorer_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: 'network_name',
        },
    },
    {
        timestamps: false,
    }
);

const mainnet = {
    name: "Mainnet",
    rpc_url: "https://rpc.mevblocker.io",
    chain_id: 1,
    currency_symbol: "ETH",
    block_explorer_url: "https://etherscan.io/",
    logo: "eth_logo",
    is_default: true,
}

const sepoliaTestNet = {
    name: "SepoliaTestnet",
    rpc_url: "https://ethereum-sepolia-rpc.publicnode.com",
    chain_id: 11155111,
    currency_symbol: "SepoliaETH",
    block_explorer_url: "https://sepolia.etherscan.io/",
    logo: "sepolia_eth_logo",
    is_default: true,
}

const nebulasTestNet = {
    name: "NebulasTestnet",
    rpc_url: "https://rpc-nebulas-testnet.uniultra.xyz/",
    chain_id: 2484,
    currency_symbol: "U2U Testnet",
    block_explorer_url: "https://sepolia.etherscan.io/",
    logo: "nebulas_logo",
    is_default: true,
}


export const defaultNetwork = [mainnet, sepoliaTestNet, nebulasTestNet]
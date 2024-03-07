import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const ERC721 = sequelize.define(
    "erc721_tokens",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        contract_address: {
            type: DataTypes.STRING,
            unique: 'nft_constraint',
        },
        token_id: {
            type: DataTypes.INTEGER,
            unique: 'nft_constraint',
        },
        symbol: {
            type: DataTypes.STRING,
        },
        account_id: {
            type: DataTypes.INTEGER,
            unique: 'nft_constraint',
        },
        network_id: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: false,
    }
);
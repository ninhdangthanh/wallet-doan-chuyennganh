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
        },
        token_id: {
            type: DataTypes.INTEGER,
        },
        symbol: {
            type: DataTypes.STRING,
        },
        account_id: {
            type: DataTypes.INTEGER,
        },
        network_id: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: false,
    }
);
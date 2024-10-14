import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const ERC20 = sequelize.define(
    "erc20_tokens",
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
            unique: 'erc20token',
        },
        symbol: {
            type: DataTypes.STRING,
        },
        decimal: {
            type: DataTypes.INTEGER,
        },
        account_id: {
            type: DataTypes.INTEGER,
            unique: 'erc20token',
        },
    },
    {
        timestamps: true,
    }
);
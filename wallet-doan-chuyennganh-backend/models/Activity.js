import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";
import { Account } from "./Account.js";

export const Activity = sequelize.define(
    "activities",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tx_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        to: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.STRING,
        },
        nonce: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            values: ['FAILED', 'PENDING', 'SUCCESS'], 
        },
        account_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
    },
    {
        timestamps: true,
    }
);
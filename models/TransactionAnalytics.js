import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const TxsAnalytics = sequelize.define(
    "txs_analytics",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tx_hash: {
            type: DataTypes.STRING,
        },
        gas: {
            type: DataTypes.STRING,
        },
        block_number: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
    }
);
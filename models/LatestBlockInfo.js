import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const LatestBlockInfo = sequelize.define(
    "latest_block_info",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        block_number: {
            type: DataTypes.INTEGER,
        },
        miner: {
            type: DataTypes.STRING,
        },
        gas_used: {
            type: DataTypes.STRING,
        },
        transaction_count: {
            type: DataTypes.INTEGER,
        },
        block_mined_at: {
            type: DataTypes.STRING,
        },
        time_between_blocks: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
    }
);
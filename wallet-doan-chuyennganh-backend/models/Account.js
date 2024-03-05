import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Account = sequelize.define(
    "accounts",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: 'user_name',
        },
        privateKey: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: 'user_name', 
        },
    },
    {
        timestamps: false,
    }
);
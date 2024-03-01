import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const User = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        temporary_password: {
            type: DataTypes.STRING,
        },
        temporary_password_expired: {
            type: DataTypes.BIGINT,
        },
    },
    {
        timestamps: false,
    }
);
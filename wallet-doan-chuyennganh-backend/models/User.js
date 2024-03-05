import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";
import { Account } from "./Account.js";

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
            unique: true, 
        },
        password: {
            type: DataTypes.STRING,
        },
        temporary_password: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        temporary_password_expired: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    },
    {
        timestamps: false,
    }
);

User.hasMany(Account, {
    foreignKey: "user_id",
    sourceKey: "id",
});

Account.belongsTo(User, {
    foreignKey: "user_id",
    targetId: "id",
});
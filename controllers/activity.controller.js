import { Op } from "sequelize";
import { Activity } from "../models/Activity.js";
import { Account } from "../models/Account.js";

export const createActivity = async (req, res) => {
    try {
        const user_id = req.user.id
        let newActivity = req.body
        newActivity.user_id = user_id;

        const created = await Activity.create(req.body);
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActivitiesOfAccount = async (req, res) => {
    try {
        let accountId = req.params.accountId

        const account = await Account.findOne({ where: { id: accountId } });
        
        if (!account) {
            return res.status(404).json({ message: "Account not found for the specified user" });
        }
        
        const account_address = account.address;
        
        const activities = await Activity.findAll({
            where: {
                [Op.or]: [
                    { account_id: accountId },
                    { to: account_address }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getActivityById = async (req, res) => {
    try {
        console.log("detail");
        
        const activity = await Activity.findByPk(req.params.id);
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateActivity = async (req, res) => {
    try {
        const [updated] = await Activity.update(req.body, {
            where: { id: req.params.id },
        });

        if (updated) {
            const updatedActivity = await Activity.findByPk(req.params.id);
            res.status(200).json(updatedActivity);
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const deleted = await Activity.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

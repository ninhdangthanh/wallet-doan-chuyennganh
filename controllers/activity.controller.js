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
        const accountId = req.params.accountId;
        const { page = 1, pageSize = 10, type, status } = req.query; // Pagination and filters from query params
        // console.log("accountId", accountId, req.query);
        

        const limit = parseInt(pageSize, 10) || 10; // Default pageSize to 10 if not provided
        const offset = (parseInt(page, 10) - 1) * limit; // Calculate offset for pagination

        const account = await Account.findOne({ where: { id: accountId } });
        
        if (!account) {
            return res.status(404).json({ message: "Account not found for the specified user" });
        }
        
        const account_address = account.address;

        const whereCondition = {
            [Op.or]: [{ account_id: accountId }, { to: account_address }]
        };

        if (type === 'Receive') {
            whereCondition.to = account_address;
        } else if (type === 'Transfer') {
            whereCondition.from = account_address;
        }

        if (status) {
            whereCondition.status = status.toUpperCase(); // Ensure the status matches the ENUM (e.g., 'FAILED', 'PENDING', 'SUCCESS')
        }

        const activities = await Activity.findAll({
            where: whereCondition,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const totalCount = await Activity.count({ where: whereCondition });

        res.status(200).json({
            data: activities,
            pagination: {
                currentPage: parseInt(page, 10),
                pageSize: limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching activities: ${error.message}` });
    }
};


export const getActivityById = async (req, res) => {
    try {
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

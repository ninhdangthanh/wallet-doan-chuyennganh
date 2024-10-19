import { Op } from "sequelize";
import { Activity } from "../models/Activity.js";

export const createActivity = async (req, res) => {
    try {
        const newActivity = await Activity.create(req.body);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActivitiesOfAccount = async (req, res) => {
    try {
        let account_address = req.body.id;

        const activities = await Activity.findAll({
            where: {
                [Op.or]: [
                    { from: account_address },
                    { to: account_address }
                ]
            }
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const Roles = {
    SDC_MANAGER: 'SDC Manager',
    Training_Coordinator: "Training Coordinator",
    Project_MANAGER: 'Project Manager',
    Direct_Mentor: "Direct Mentor",
    Viewer: "Viewer"
}

const inRoles = (...roles) => async (req, res, next) => {
    const role = await roles.find((role) =>
        req.user.role.indexOf(role) !== -1
    )
    if (!role) {
        return res.status(401).json({ msg: "Access Denied" })
    }
    next()
}

module.exports = {
    inRoles,
    Roles,
};
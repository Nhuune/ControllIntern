const express = require("express");
const {
    deleteOneRoleUser,
    editOneRoleUser,
    getAllRoleUser,
    getByIdRoleUser,
    postOneRoleUser,
} = require("../controllers/roleUserController");
const router = express.Router()

router.get("/", getAllRoleUser)
router.get("/:_id", getByIdRoleUser)
router.post("/", postOneRoleUser)
router.patch("/:_id", editOneRoleUser)
router.delete("/:_id", deleteOneRoleUser)

module.exports = router;
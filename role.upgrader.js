let Role = require("role");

class UpgraderRole extends Role {
    static run_in_work(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}
module.exports = UpgraderRole;

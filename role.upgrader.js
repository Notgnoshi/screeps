let Role = require("role");

class UpgraderRole extends Role {
    /** @param {Creep} creep **/
    static run_in_work(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#FFAA00" } });
        }
    }
}
module.exports = UpgraderRole;
let Role = require("role");

class HaulerRole extends Role {
    /** @param {Creep} creep **/
    static run_in_work(creep) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                s.energy < s.energyCapacity,
        });
        if (structure == undefined) {
            structure = creep.room.storage;
        }

        // If there's nothing to haul to, upgrade the controller
        if (structure == undefined) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
            return;
        }

        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, { visualizePathStyle: { stroke: "$FFFFFF" } });
        }
    }
}
module.exports = HaulerRole;

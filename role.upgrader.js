let Role = require("role");

class Upgrader extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 2;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#FFAA00" } });
        }
    }
}
module.exports = Upgrader;

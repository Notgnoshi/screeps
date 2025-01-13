let Role = require("role");
let Upgrader = require("role.upgrader");

class Builder extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, WORK, CARRY, CARRY, MOVE];
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 6;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (site != undefined) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            Upgrader.run_in_work(creep);
        }
    }
}

module.exports = Builder;

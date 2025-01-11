let Role = require("role");
let BuilderRole = require("role.builder");

class HarvesterRole extends Role {
    /** @param {Creep} creep **/
    static run_in_work(creep) {
        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                s.energy < s.energyCapacity,
        });
        if (structure != undefined) {
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            BuilderRole.run_in_work(creep);
        }
    }

    /** @param {Creep} creep **/
    static run_out_of_work(creep) {
        // Harvest just from sources, not containers
        Role.harvest_from_source(creep);
    }
}

module.exports = HarvesterRole;

let Role = require("role");
let BuilderRole = require("role.builder");

class HarvesterRole extends Role {
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
                creep.moveTo(structure);
            }
        } else {
            BuilderRole.run_in_work(creep);
        }
    }
}

module.exports = HarvesterRole;

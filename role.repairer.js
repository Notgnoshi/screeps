let Role = require("role");
let BuilderRole = require("role.builder");

class RepairerRole extends Role {
    static run_in_work(creep) {
        let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL,
        });
        if (structure != undefined) {
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            BuilderRole.run_in_work(creep);
        }
    }
}

module.exports = RepairerRole;

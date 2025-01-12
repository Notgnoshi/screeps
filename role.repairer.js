let Role = require("role");
let Builder = require("role.builder");

class Repairer extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 1;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL,
        });
        if (structure != undefined) {
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            Builder.run_in_work(creep);
        }
    }
}

module.exports = Repairer;

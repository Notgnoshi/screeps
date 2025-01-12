let Role = require("role");
let Builder = require("role.builder");

class Harvester extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, WORK, CARRY, MOVE];
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 1;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        if (structure != undefined) {
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            Builder.run_in_work(creep);
        }
    }

    /** @param {Creep} creep **/
    static run_out_of_work(creep) {
        // Harvest just from sources, not containers
        this.harvest_from_source(creep);
    }
}

module.exports = Harvester;

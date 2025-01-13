let Role = require("role");
let Upgrader = require("role.upgrader");

class Hauler extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 3;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        // Prioritize "useful" buildings over storage
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        // But still fill storage if possible, this will help keep the containers empty, so that the
        // miners can keep working
        if (structure == undefined) {
            structure = creep.room.storage;
        }

        // If there's nothing to haul to, upgrade the controller
        if (structure == undefined) {
            return Upgrader.run_in_work(creep);
        }

        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, { visualizePathStyle: { stroke: "#FFFFFF" } });
        }
    }
}
module.exports = Hauler;

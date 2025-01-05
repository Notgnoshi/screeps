var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            console.log("Creep " + creep.name + " stopping work");
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            console.log("Creep " + creep.name + " starting work");
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
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
            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    },
};

module.exports = roleBuilder;

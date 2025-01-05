let roleUpgrader = require("role.upgrader");

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
            let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (site != undefined) {
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
            } else {
                roleUpgrader.run(creep);
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

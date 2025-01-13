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
        let all_damaged = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax,
        });
        var repair_target;
        for (let percent = 0.01; percent <= 1; percent = percent + 0.01) {
            for (let damaged of all_damaged) {
                if (damaged.hits / damaged.hitsMax < percent) {
                    repair_target = damaged;
                    break;
                }
                // need to break out of the outer loop too
                if (repair_target) {
                    break;
                }
            }
        }
        if (repair_target) {
            if (creep.repair(repair_target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repair_target, { visualizePathStyle: { stroke: "#FF0000" } });
            }
        } else {
            Builder.run_in_work(creep);
        }
    }
}

module.exports = Repairer;

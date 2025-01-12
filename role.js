class Role {
    /** @param {Creep} creep **/
    static update_work_state(creep) {
        // TODO: This could get smarter, and check if the carry.energy is lower than half capacity,
        // and an energy source is closer to the creep than the work site, then switch out of work
        if (creep.memory.working == true && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            // console.log(`Creep ${creep.name} stopping work; return to collect energy`);
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            // console.log(`Creep ${creep.name} starting work; energy full`);
            creep.memory.working = true;
        }
    }

    /** @param {Creep} creep **/
    static run(creep) {
        this.update_work_state(creep);
        if (creep.memory.working == true) {
            this.run_in_work(creep);
        } else {
            this.run_out_of_work(creep);
        }
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {} // eslint-disable-line

    /** @param {Creep} creep **/
    static withdraw_from_container(creep) {
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
        });
        if (container != undefined) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: "#FFFFFF" } });
            }
            return true;
        }
        return false;
    }

    /** @param {Creep} creep **/
    static harvest_from_source(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: "#FFFFFF" } });
        }
    }

    /** @param {Creep} creep **/
    static run_out_of_work(creep) {
        if (!this.withdraw_from_container(creep)) {
            this.harvest_from_source(creep);
        }
    }
}

module.exports = Role;

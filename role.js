class Role {
    static update_work_state(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            console.log(`Creep ${creep.name} stopping work; return to collect energy`);
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            console.log(`Creep ${creep.name} starting work; energy full`);
            creep.memory.working = true;
        }
    }

    static run(creep) {
        this.update_work_state(creep);
        if (creep.memory.working == true) {
            this.run_in_work(creep);
        } else {
            this.run_out_of_work(creep);
        }
    }

    static run_in_work(creep) {}

    static run_out_of_work(creep) {
        // TODO: Include energy storage buildings
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

module.exports = Role;

let _ = require("lodash");

// TODO: Using static methods is how I got fallback behavior to work. Otherwise, I'd need a
// potentially very complex inheritance tree? But now, moving spawning behavior into Roles, I'm
// second guessing.
class Role {
    static role_name() {
        return this.name.toLowerCase();
    }

    /** Get the body components suitable for this Role in the given room
     *
     * @param {StructureSpawn} spawn **/
    static components(spawn) {
        return [WORK, CARRY, MOVE];
    }

    /** Total number of creeps in the given spawn's room that should be assigned to this Role
     *
     * @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return 0;
    }

    /** Get the actual number of creep assigned to this Role in the given room
     *
     * @param {StructureSpawn} spawn **/
    static num_creeps_actual(spawn) {
        let creeps = spawn.room.find(FIND_MY_CREEPS);
        let num = _.sum(creeps, (c) => c.memory.assigned_role == this.role_name());
        return num;
    }

    /** Spawn a new creep assigned to this Role
     *
     * @param {StructureSpawn} spawn **/
    static spawn_creep(spawn, dry_run = false) {
        let name = this.name + Game.time;
        if (!dry_run) {
            console.log(`Spawning creep ${name}`);
        }
        // TODO: Subclasses should be allowed to inject whatever they want
        let memory = {
            home: spawn.room.name,
            working: false,
            assigned_role: this.role_name(),
        };
        let status = spawn.spawnCreep(this.components(), name, { memory: memory, dryRun: dry_run });
        return status == OK;
    }

    /** Spawn a new creep assigned to this Role, if needed
     *
     * @param {StructureSpawn} spawn **/
    static spawn_if_needed(spawn) {
        // By exiting if the spawn is already spawning, we guarantee that this.spawn_creep() will
        // only be called once
        if (spawn.spawning) {
            return;
        }

        // Determine if a new creep needs to be spawned
        let total_needed = this.num_creeps_needed(spawn);
        let actual = this.num_creeps_actual(spawn);
        if (actual < total_needed) {
            console.log(`${this.name} creep needed`);
            let can_spawn = this.spawn_creep(spawn, true); // dry run
            if (can_spawn) {
                this.spawn_creep(spawn);
            }
        }
    }

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
        // TODO: Remove this once spawning gets moved into Role
        let spawn = Game.spawns["Spawn1"];
        if (!creep.memory.home) {
            creep.memory.home = spawn.room.name;
        }
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

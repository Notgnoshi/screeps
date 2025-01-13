let Role = require("role");
let _ = require("lodash");

Memory.long_haul_room_assignments = { W7N3: 3, W8N2: 2 };

class LongHaul extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        var components = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        let base_cost = 100 + 100 + 100 + 50 + 50 + 50 + 50;
        var energy_available = spawn.room.energyCapacityAvailable;
        energy_available -= base_cost;
        var possible_pairs = Math.floor(energy_available / 100); // number of additional CARRY+MOVE pairs we can add
        possible_pairs = Math.min(50 - components.length, possible_pairs);

        for (let i = 0; i < possible_pairs; i++) {
            components.push(CARRY);
            components.push(MOVE);
        }

        return components;
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return _.sum(_.values(Memory.long_haul_room_assignments));
    }

    /** Finished collecting; go drop off resources in the home room
     *
     * @param {Creep} creep **/
    static run_in_work(creep) {
        // TODO: head to the spawn first to renew the creep
        let available_containers = Game.rooms[creep.memory.home].find(FIND_MY_STRUCTURES, {
            filter: (s) =>
                (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        if (available_containers.length > 0) {
            // pick one
            let container = available_containers[0];
            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: "#00FF00" } });
            }
        }
    }

    /** Go to the target room and harvest resources
     *
     * @param {Creep} creep **/
    static run_out_of_work(creep) {
        if (!creep.memory.target_room) {
            this.assign_hauler_to_room(creep);
            return;
        }

        // Sources in a room aren't visible from code until there's a friendly creep or structure in
        // that room. So we can't just iterate over assigned sources, we have to let the creep
        // decide what source to pick once it enters the target room.
        //
        // TODO: But maybe creeps can assign their own source once they're in the room?

        if (creep.room.name == creep.memory.target_room) {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: "#FFFFFF" } });
            }
        }
        // Get to the target room
        else {
            let exit = creep.room.findExitTo(creep.memory.target_room);
            creep.moveTo(creep.pos.findClosestByPath(exit), { visualizePathStyle: { stroke: "#FF0000" } });
        }
    }

    /** @param {Creep} creep **/
    static assign_hauler_to_room(creep) {
        if (creep.memory.target_room) {
            console.log(`Creep ${creep.name} already has a target room`);
            return;
        }

        for (let room in Memory.long_haul_room_assignments) {
            let num_needed_haulers = Memory.long_haul_room_assignments[room];
            let actual_haulers = _.filter(
                Game.creeps,
                (c) => c.memory.assigned_role == "longhaul" && c.memory.target_room == room,
            );
            // Pick the first available room
            if (actual_haulers.length < num_needed_haulers) {
                console.log(`Assigning creep ${creep.name} to harvest in room ${room}`);
                creep.memory.target_room = room;
            }
        }
    }
}

module.exports = LongHaul;

let Role = require("role");
let _ = require("lodash");
let Harvester = require("role.harvester");

class Miner extends Role {
    /** @param {StructureSpawn} spawn **/
    static components(spawn) {
        var energy_available = spawn.room.energyCapacityAvailable;
        let base_energy_cost = 50 + 50; // the base CARRY + MOVE
        energy_available -= base_energy_cost;
        var possible_works = Math.floor(energy_available / 100);
        // Each WORK component harvests 2 energy / tick. Each source is 3000 energy, regenerated
        // every 300 ticks. That means a maximum of 5 WORK components is needed to max out
        // harvesting, so long as the miner is always working.
        let max_works = 6;
        possible_works = Math.min(possible_works, max_works);
        possible_works = Math.max(2, possible_works); // always at least two WORKs

        var components = [CARRY, MOVE];
        for (let i = 0; i < possible_works; i++) {
            components.push(WORK);
        }

        return components;
    }

    /** @param {StructureSpawn} spawn **/
    static num_creeps_needed(spawn) {
        return spawn.room.find(FIND_SOURCES).length;
    }

    /** @param {Creep} creep **/
    static run_in_work(creep) {
        if (creep.memory.assigned_source == undefined) {
            this.assign_miner_to_unclaimed_source(creep);
        }

        // Assignment failed. The creep should still do something useful
        if (creep.memory.assigned_source == undefined) {
            Harvester.run_in_work(creep);
            return;
        }

        let source = Game.getObjectById(creep.memory.assigned_source);

        let container = source.pos.findInRange(FIND_STRUCTURES, 2, {
            filter: (s) =>
                (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                // If there are multiple containers available, only try to fill ones with space
                // available
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        })[0];

        if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
    }

    /** @param {Creep} creep **/
    static run_out_of_work(creep) {
        if (creep.memory.assigned_source == undefined) {
            Harvester.run_out_of_work(creep);
            return;
        }

        let source = Game.getObjectById(creep.memory.assigned_source);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    /** @param {Creep} creep **/
    static assign_miner_to_unclaimed_source(creep) {
        console.log(`Attempting to assign miner ${creep.name} to an unclaimed source`);
        // Find unassigned sources
        let all_sources = creep.room.find(FIND_SOURCES);
        let all_miners = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.assigned_role == "miner",
        });
        let unassigned_sources = _.filter(all_sources, (s) => {
            for (let miner of all_miners) {
                if (miner.memory.assigned_source == s.id) {
                    console.log(`Source ${s.id} is already claimed`);
                    return false;
                }
            }
            console.log(`Source ${s.id} is unclaimed`);
            return true;
        });
        if (unassigned_sources.length > 0) {
            console.log(`Assigning miner ${creep.name} to source id ${unassigned_sources[0].id}`);
            creep.memory.assigned_source = unassigned_sources[0].id;
        }
    }
}

module.exports = Miner;

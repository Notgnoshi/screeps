let Role = require("role");
let _ = require("lodash");
let HarvesterRole = require("role.harvester");

class MinerRole extends Role {
    static run_in_work(creep) {
        if (creep.memory.assigned_source == undefined) {
            MinerRole.assign_miner_to_unclaimed_source(creep);
        }

        HarvesterRole.run_in_work(creep);
    }

    static assign_miner_to_unclaimed_source(creep) {
        console.log(`Attempting to assign miner ${creep.name} to an unclaimed source`);
        // Find unassigned sources
        let all_sources = creep.room.find(FIND_SOURCES);
        let all_miners = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role == "miner",
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

module.exports = MinerRole;

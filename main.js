let TowerRole = require("tower");
let Roles = {
    builder: require("role.builder"),
    harvester: require("role.harvester"),
    hauler: require("role.hauler"),
    longhaul: require("role.longhaul"),
    miner: require("role.miner"),
    repairer: require("role.repairer"),
    upgrader: require("role.upgrader"),
};

let _ = require("lodash");

function spawn_creeps() {
    let spawn = Game.spawns["Spawn1"];
    if (spawn.spawning) {
        spawn.room.visual.text(spawn.spawning.name, spawn.pos.x, spawn.pos.y);
    }

    for (let role_name in Roles) {
        let role = Roles[role_name];
        role.spawn_if_needed(spawn);
    }
}

function manage_towers() {
    let my_towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    for (let tower of my_towers) {
        TowerRole.run(tower);
    }
}

function manage_live_creeps() {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let role_name = creep.memory.assigned_role;

        if (Roles[role_name]) {
            Roles[role_name].run(creep);
        } else {
            console.log(`Failed to find role ${role_name} for creep ${creep.name}`);
            // fallback on harvester, because that's better than sitting still
            Roles["harvester"].run(creep);
        }
    }
}

function cleanup_dead_creeps() {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            console.log("RIP " + name);
            delete Memory.creeps[name];
        }
    }
}

function main() {
    cleanup_dead_creeps();
    spawn_creeps();
    manage_towers();
    manage_live_creeps();
}

module.exports.loop = main;

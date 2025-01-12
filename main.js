let TowerRole = require("tower");
let Roles = {
    builder: require("role.builder"),
    harvester: require("role.harvester"),
    hauler: require("role.hauler"),
    miner: require("role.miner"),
    repairer: require("role.repairer"),
};

let _ = require("lodash");

function spawn_creeps() {
    let spawn = Game.spawns["Spawn1"];
    let creeps = spawn.room.find(FIND_MY_CREEPS);

    let num_sources = spawn.room.find(FIND_SOURCES).length;

    let roles = [
        {
            name: "harvester",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 1,
        },
        {
            name: "hauler",
            components: [WORK, CARRY, CARRY, MOVE, MOVE],
            needed: 3,
        },
        {
            name: "builder",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 4,
        },
        {
            name: "repairer",
            components: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            needed: 2,
        },
        {
            name: "miner",
            components: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
            needed: num_sources,
        },
    ];
    for (let role of roles) {
        let num = _.sum(creeps, (c) => c.memory.role == role.name);
        if (num < role.needed) {
            let difference = role.needed - num;
            console.log("Need " + difference + " more " + role.name);
            let name = role.name + Game.time;
            let status = spawn.spawnCreep(role.components, name, { memory: { role: role.name, working: false } });
            if (status == OK) {
                console.log("Spawned " + name);
            } else {
                console.log("Failed to spawn " + name + ": " + status);
            }
        }
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

        if (Roles[creep.memory.role]) {
            Roles[creep.memory.role].run(creep);
        } else {
            console.log("Failed to find role " + creep.memory.role);
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

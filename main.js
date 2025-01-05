let roleBuilder = require("role.builder");
let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");

let _ = require("lodash");

function spawn_creeps() {
    let spawn = Game.spawns["Spawn1"];
    let creeps = spawn.room.find(FIND_MY_CREEPS);

    let roles = [
        {
            name: "harvester",
            components: [WORK, CARRY, MOVE],
            needed: 1,
        },
        {
            name: "upgrader",
            components: [WORK, CARRY, MOVE],
            needed: 2,
        },
        {
            name: "builder",
            components: [WORK, CARRY, MOVE],
            needed: 1,
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

function manage_live_creeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == "harvester") {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
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

function assign_miners() {
    let spawn = Game.spawns["Spawn1"];
    let creeps = spawn.room.find(FIND_MY_CREEPS);
}

function main() {
    cleanup_dead_creeps();
    spawn_creeps();
    manage_live_creeps();
}

module.exports.loop = main;

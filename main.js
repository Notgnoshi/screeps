let Roles = {
    builder: require("role.builder"),
    harvester: require("role.harvester"),
    repairer: require("role.repairer"),
    upgrader: require("role.upgrader"),
};

let _ = require("lodash");

function spawn_creeps() {
    let spawn = Game.spawns["Spawn1"];
    let creeps = spawn.room.find(FIND_MY_CREEPS);

    let roles = [
        {
            name: "harvester",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 1,
        },
        {
            name: "upgrader",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 1,
        },
        {
            name: "builder",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 2,
        },
        {
            name: "repairer",
            components: [WORK, WORK, CARRY, MOVE],
            needed: 1,
        }
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

        if (Roles[creep.memory.role]) {
            Roles[creep.memory.role].run(creep);
        } else {
            console.log("Failed to find role " + creep.memory.role);
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
    let creeps = spawn.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == "miner" });
}

function main() {
    cleanup_dead_creeps();
    spawn_creeps();
    manage_live_creeps();
}

module.exports.loop = main;

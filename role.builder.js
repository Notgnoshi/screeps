let Role = require("role");
let UpgraderRole = require("role.upgrader");

class BuilderRole extends Role {
    static run_in_work(creep) {
        let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (site != undefined) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
        } else {
            UpgraderRole.run_in_work(creep);
        }
    }
}

module.exports = BuilderRole;

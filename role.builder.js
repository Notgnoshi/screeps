let Role = require("role");
let HaulerRole = require("role.hauler");

class BuilderRole extends Role {
    static run_in_work(creep) {
        let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (site != undefined) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site, { visualizePathStyle: { stroke: "#FFAA00" } });
            }
        } else {
            HaulerRole.run_in_work(creep);
        }
    }
}

module.exports = BuilderRole;

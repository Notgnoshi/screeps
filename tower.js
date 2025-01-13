class TowerRole {
    /** @param {StructureTower} tower **/
    static run(tower) {
        if (!this.defend(tower)) {
            if (!this.heal(tower)) {
                this.repair(tower);
            }
        }
    }

    /** @param {StructureTower} tower **/
    static defend(tower) {
        let closest_hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closest_hostile) {
            tower.attack(closest_hostile);
            return true;
        }
        return false;
    }

    /** @param {StructureTower} tower **/
    static heal(tower) {
        let closest_damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax,
        });
        if (closest_damaged) {
            tower.heal(closest_damaged);
            return true;
        }
        return false;
    }

    /** @param {StructureTower} tower **/
    static repair(tower) {
        let all_damaged = tower.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax,
        });
        var repair_target;
        for (let percent = 0.01; percent <= 1; percent = percent + 0.01) {
            for (let damaged of all_damaged) {
                if (damaged.hits / damaged.hitsMax < percent) {
                    repair_target = damaged;
                    break;
                }
                // need to break out of the outer loop too
                if (repair_target) {
                    break;
                }
            }
        }

        if (repair_target) {
            tower.repair(repair_target);
            return true;
        }
        return false;
    }
}

module.exports = TowerRole;

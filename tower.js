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
        let closest_damaged = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax,
        });

        if (closest_damaged) {
            tower.repair(closest_damaged);
            return true;
        }
        return false;
    }
}

module.exports = TowerRole;

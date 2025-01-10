let Role = require("role");

// TODO:
// * Need some way of assigning miners to sources. This will probably need to be assigned when the
//   miner is created. This in turn, might require putting spawning-related logic in the Role?
// * Need way of ensuring the haulers don't just service the closest container
class MinerRole extends Role {
    static run_in_work(creep) {}
}

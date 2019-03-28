const roomStartup = require('./roomStartup')

module.exports.loop = () => {
    let currentRoom = Game.spawns.Spawn1.room.name // make currentRoom dynamically update using a for in loop (see deleting memory names below)
    let RCL = Game.rooms[currentRoom].controller.level;

    // Delete Dead Creep Memory Names
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
            console.log(`${name} died. Memory cleared.`);
        }
    }

    // Starting creep setup for new rooms under RCL 3
    if (RCL < 3) {
        roomStartup;
    }
}
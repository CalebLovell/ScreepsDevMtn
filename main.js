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
        // Importing roles
        const roleHarvester = require('./role.harvester')
        const roleUpgrader = require('./role.upgrader')
        const roleBuilder = require('./role.builder')

        // Name creeps based on Role + Game Time
        function namer(role) {
            return `${role}${Game.time.toString()}`
        }

        // Setting number of max noob creeps
        let numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester'); // turn into .reduce functions
        let numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        let numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');

        // Controlling noob creeps
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            } else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            } else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }

        // Game.spawn the noob creeps
        if (numberOfHarvesters < 8) {
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], namer('Harvester'),
                {
                    memory: {
                        role: 'harvester',
                        HAVE_LOAD: false,
                    }
                });
        } else if (numberOfUpgraders < 6) {
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], namer('Upgrader'),
                {
                    memory: {
                        role: 'upgrader',
                        HAVE_LOAD: false,
                    }
                });
        } else {
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], namer('Builder'),
                {
                    memory: {
                        role: 'builder',
                        HAVE_LOAD: false,
                    }
                });
        }

        // Console log the number of each noob creep
        console.log(`Harv: ${numberOfHarvesters} Upgrad: ${numberOfUpgraders} Builder: ${numberOfBuilders}`);
    }
}
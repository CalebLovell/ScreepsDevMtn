// Importing roles
const roleHarvester = require('./role.harvester')
const roleUpgrader = require('./role.upgrader')
const roleBuilder = require('./role.builder')

// Name creeps based on Role + Game Time
function namer(role) {
    return `${role}${Game.time.toString()}`
}

// Setting number of max noob creeps
let numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester'); // turn into reduce functions
let numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');

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
} else if (numberOfUpgraders < 5) {
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


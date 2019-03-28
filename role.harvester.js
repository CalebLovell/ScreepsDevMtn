module.exports = {
  run: function (creep) {
    // State Switching & Say Action
    if (creep.memory.HAVE_LOAD == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.HAVE_LOAD = true;
      creep.say('\u{1f69A}'); // truck emojii unicode
    }
    if (creep.memory.HAVE_LOAD == true && creep.carry.energy == 0) {
      creep.memory.HAVE_LOAD = false;
      creep.say('\u{26CF}'); // pick emojii unicode
    }
    // Variables
    const HAVE_LOAD = creep.memory.HAVE_LOAD;
    let source = creep.pos.findClosestByPath(FIND_SOURCES);
    let unfilledStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => (
        s.structureType == STRUCTURE_EXTENSION ||
        s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_TOWER)
        && s.energy < s.energyCapacity
    });
    // State 3: Creep does HAVE_LOAD, is not at unfilled structure -> Move to unfilled structure
    if (HAVE_LOAD && unfilledStructure != null && !creep.pos.isNearTo(unfilledStructure)) {
      creep.moveTo(unfilledStructure, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
      return OK;
    }
    // State 1: Creep does not HAVE_LOAD, not at source -> Move to closest one
    if (!HAVE_LOAD && source != null && !creep.pos.isNearTo(source)) {
      creep.moveTo(source, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      return OK;
    }
    // State 2: Creep does not HAVE_LOAD, is at source -> Harvest it
    if (!HAVE_LOAD && source != null && creep.pos.isNearTo(source)) {
      creep.harvest(source);
      return OK;
    }
    // State 4: Creep does HAVE_LOAD, is at unfilled structure -> Transfer energy to unfilled structure
    if (HAVE_LOAD && unfilledStructure != null && creep.pos.isNearTo(unfilledStructure)) {
      creep.transfer(unfilledStructure, RESOURCE_ENERGY);
      return OK;
    }
  }
}
var roleRepairer = require('role.repairer');

module.exports = {
  run: function(creep) {
    // State Switching & Say Action
    if (creep.memory.HAVE_LOAD == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.HAVE_LOAD = true;
      creep.say('\u{1F528}'); // hammer emojii unicode
    }
    if (creep.memory.HAVE_LOAD == true && creep.carry.energy == 0) {
      creep.memory.HAVE_LOAD = false;
      creep.say('\u{267B}'); // recycle emojii unicode
    }
    // Variables
    const HAVE_LOAD = creep.memory.HAVE_LOAD
    let filledStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => (
        s.structureType == STRUCTURE_SPAWN ||
        s.structureType == STRUCTURE_EXTENSION)
        && s.energy > 0
    });
    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    // State 1: Creep does not HAVE_LOAD, is not at filled structure -> Move to it
      if (!HAVE_LOAD && filledStructure != null && !creep.pos.isNearTo(filledStructure)) {
        creep.moveTo(filledStructure, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
        return OK;
      }
    // State 2: Creep does not HAVE_LOAD, is at filled structure -> Withdraw energy
    if (!HAVE_LOAD && filledStructure != null && creep.pos.isNearTo(filledStructure)) {
      creep.withdraw(filledStructure, RESOURCE_ENERGY);
      return creep.withdraw(filledStructure, RESOURCE_ENERGY);
    }
    // State 3: Creep does HAVE_LOAD, is not at construction site -> Move to nearest one
    if (HAVE_LOAD && constructionSite != null && !creep.pos.inRangeTo(constructionSite, 3)) {
      creep.moveTo(constructionSite, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
      return OK;
    }
    // State 4: Creep does HAVE_LOAD, is at construction site -> Build it
    if (HAVE_LOAD && constructionSite != null && creep.pos.inRangeTo(constructionSite, 3)) {
      creep.build(constructionSite)
      return OK;
    }
  }
}

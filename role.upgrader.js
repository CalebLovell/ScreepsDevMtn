module.exports = {
  run: function(creep) {
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
    var HAVE_LOAD = creep.memory.HAVE_LOAD;
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    var controller = creep.room.controller
    // DELETE AFTER SPAWN FIX
    var structuresFill = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_EXTENSION ||
          s.structureType == STRUCTURE_SPAWN ||
          s.structureType == STRUCTURE_TOWER) &&
          s.energy < s.energyCapacity
    });
    // ~~~~~~~~~~~~~~~DELETE ABOVE
    // Step 1: Creep does not HAVE_LOAD, is at source -> Harvest it
    if (!HAVE_LOAD && null != source && creep.pos.isNearTo(source)) {
      creep.harvest(source);
      return OK;
    }
    // Step 2: Creep does not HAVE_LOAD, not at source -> Move to closest one
    if (!HAVE_LOAD && null != source && !creep.pos.isNearTo(source)) {
      creep.moveTo(source, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      return OK;
    }
    // STOLEN FROM HARVESTER, DELETE AFTER SPAWN FIX
    if (HAVE_LOAD && null != structuresFill && !creep.pos.isNearTo(structuresFill)) {
      creep.moveTo(structuresFill, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
      return OK;
    }
    if (HAVE_LOAD && null != structuresFill && creep.pos.isNearTo(structuresFill)) {
      creep.transfer(structuresFill, RESOURCE_ENERGY);
      return OK;
    }
    // ~~~~~~~~~~~~~~~DELETE ABOVE. ALSO DELETE null == structuresFill TWICE BELOW
    // Step 3: Creep does HAVE_LOAD, not at structuresFill -> Move to structuresFill
    // Creep move to structuresFill if not full of energy
    if (HAVE_LOAD && null == structuresFill && null != controller && !creep.pos.inRangeTo(controller, 3)) {
      creep.moveTo(controller, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
      return OK;
    }
    // Fill structuresFill
    if (HAVE_LOAD && null == structuresFill && null != controller && creep.pos.inRangeTo(controller, 3)) {
      creep.upgradeController(controller);
      return OK;
    }
  }
}

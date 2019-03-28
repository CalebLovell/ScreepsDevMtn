module.exports = {
  run: function (creep) {
    // State Switching & Say Action
    if (creep.memory.HAVE_LOAD == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.HAVE_LOAD = true;
      creep.say('\u{1F4DA}'); // books emojii unicode
    }
    if (creep.memory.HAVE_LOAD == true && creep.carry.energy == 0) {
      creep.memory.HAVE_LOAD = false;
      creep.say('\u{267B}'); // recycle emojii unicode
    }
    // Variables
    var HAVE_LOAD = creep.memory.HAVE_LOAD
    var storage = creep.room.storage
    var controller = creep.room.controller
    // State 1: Creep does not HAVE_LOAD, is not at storage -> Move to it
    if (!HAVE_LOAD && null != storage && !creep.pos.isNearTo(storage)) {
      creep.moveTo(storage, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      return OK;
    }
    // State 2: Creep does not HAVE_LOAD, is at dropped energy or container -> Pick it up or withdraw it
    if (!HAVE_LOAD && null != storage && creep.pos.isNearTo(storage)) {
      creep.withdraw(storage, RESOURCE_ENERGY);
      return creep.withdraw(storage, RESOURCE_ENERGY);
    }
    // State 3: Creep does HAVE_LOAD, is not at controller -> Move to it
    if (HAVE_LOAD && null != controller && !creep.pos.inRangeTo(controller, 3)) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
      return OK;
    }
    // State 4: Creep does HAVE_LOAD, is at controller -> Upgrade it
    if (HAVE_LOAD && null != controller && creep.pos.inRangeTo(controller, 3)) {
      creep.upgradeController(creep.room.controller)
      return OK;
    }
  }
}
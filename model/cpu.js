const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({
  cpuname: {
    type: String,
    required: true,
    maxlength: 24
  },
  pid: {
    photoshop: {
      type: Number,
      required: true,
      default: null
    },
    illustrator: {
      type: Number,
      required: true,
      default: null
    }
  },
  errors: [],
},
{timestamps: true});

module.exports = mongoose.model('Cpu', cpuSchema)
'use strict';

import mongoose from 'mongoose';

var POISchema = new mongoose.Schema({
  name: String,
  info: String,
  uuid: int
});

export default mongoose.model('poi', POISchema);

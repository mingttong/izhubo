/**
 * @file room model
 * @author zhouwunan
 */
 'use strict'

 const {db, mongoose} = require('./conn');

 const Crawl = new mongoose.Schema({
     room_id: Number,
     owner_name: String,
     room_name: String,
     show_status: Boolean,
     show_time: Date,
     owner_weight: String,
     fans_num: Number,
     online: Number,
     use_time: Number,
     size: Number,
     time: Date
 });

 module.exports = db.model('Crawl', Crawl);

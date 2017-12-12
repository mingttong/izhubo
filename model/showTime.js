/**
 * @file showTime model
 * @author zhouwunan
 */
'use strict'

const {db, mongoose} = require('./conn');

const ShowTime = new mongoose.Schema({
    room_id: Number,
    owner_name: String,
    room_name: String,
    show_time_length: Number, // 小时为单位
    start_time: Date,         // 开播时间
    end_time: Date,           // 关播时间
});

module.exports = db.model('ShowTime', ShowTime);

/**
 * Created by lenovo on 2017/6/2.
 */

const getAnchorInfo = require('./getAnchorInfo-api');
const readFile = require('./readFile');
const sendMsg = require('./sendMsg');

// (async function () {
//   let roomData = await readFile(__dirname + '/room-list.json');
//   roomData = JSON.parse(roomData);
//
//   let roomList = roomData.room_list;
//
//   roomList.forEach(function (roomInfo) {
//     getAnchorInfo({
//       room_id: roomInfo.room_id,
//     })
//       .then(function (info) {
//         console.log(info);
//       })
//       .catch(function (err) {
//         console.log(err);
//       })
//   })
// }());

sendMsg({
  sms_param: {
    an: '文艺少女淑女佳',
    un: '管理大人周吾南',
    rn: '淑女佳：炸厨房TV',
  },
  rec_num: 17610600266,
})
  .then(function (result) {
    console.log(result);
  })
  .catch(function (err) {
    console.log(err);
  });


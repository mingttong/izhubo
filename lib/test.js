/**
 * Created by lenovo on 2017/6/2.
 */

const getAnchorInfo = require('./getAnchorInfo-api');
const readFile = require('./readFile');

(async function () {
  let roomData = await readFile(__dirname + '/room-list.json');
  roomData = JSON.parse(roomData);

  let roomList = roomData.room_list;

  roomList.forEach(function (roomInfo) {
    getAnchorInfo({
      room_id: roomInfo.room_id,
    })
      .then(function (info) {
        console.log(info);
      })
      .catch(function (err) {
        console.log(err);
      })
  })
}());


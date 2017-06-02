/**
 * Created by lenovo on 2017/5/30.
 */
const moment = require('moment');

const getAnchorInfo = require('./getAnchorInfo-api');
// const getAnchorInfo = require('./getAnchorInfo-phantom');
const sendMsg = require('./sendMsg');
const readFile = require('./readFile');

const MAX_MSG_COUNT = 30;
const SHOW_STATUS_DELAY = 120 * 1000;
const ROOM_LIST_LOOP_DELAY = 10 * 1000;

let run_count = 0;
let msg_count = 0; // 短信数目;

// 检查列表
let checkList = [];

// 初始化check list
(async function () {

  let roomData = await readFile('./room-list.json');
  roomData = JSON.parse(roomData);

  let roomList = roomData.room_list;
  console.log(roomList);

  roomList.forEach(function (roomInfo) {
    checkList.push(checkShowStatus(roomInfo));
  });

}());

console.log('靠');

function main() {

  Promise.all(checkList)
    .then(function (v) {
      console.log('ok');
    })

}

/**
 * @description 延迟时间
 * @param time {Number}   延迟的时间（单位：ms）
 * @param fn   {Function} 要执行的函数
 * @returns    {Promise}
 */
function delay(time, fn = () => {}) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      fn();
      resolve();
    }, time);
  })
}

/**
 * @name logOutput
 * @description 日志输出
 * @param msg
 * @param formatString
 */
function logOutput(msg, formatString = 'YYYY-MM-DD HH:mm:ss') {
  console.log(msg, '- Time:', moment().format(formatString));
}

/**
 * @name checkShowStatus
 * @description 检查单个房间的直播状态
 * @param roomInfo
 * @returns {Promise.<void>}
 */
async function checkShowStatus(roomInfo) {

  logOutput(`运行${++run_count}次`);

  let room_id = roomInfo.room_id;
  // 获取主播开播的信息
  let anchorInfo = await getAnchorInfo({
    room_id: room_id,
  });
  let show_status_in_room_list = roomInfo.show_status;
  let show_status_in_anchor_info = anchorInfo.show_status;

  /**********日志输出***********/
  if (anchorInfo.show_status) {
    console.log(anchorInfo);
  } else {
    let {room_id, owner_name, show_status} = anchorInfo;
    let output = `{room_id: ${room_id}, owner_name: 【${owner_name}】, show_status: ${show_status}}`;
    console.log(output);
  }
  /********************/

  /*
   当获取到的主播信息显示正在直播，且房间列表中的信息显示未直播，（新信息显示正在直播，旧信息显示未直播）
   if the show status in anchorInfo is live, and show status in room list is not live
   则说明刚开始开播。
   then it refers to just open living.
   */
  if (show_status_in_anchor_info === true && show_status_in_room_list === false) {

    if (typeof roomInfo.end_show_time === 'undefined') {
      roomInfo.end_show_time = 0;
    }

    logOutput(`Change to show start 【${anchorInfo.owner_name}】`);

    // 开播与关播之间的时间差值要大于指定的延迟时间，才能确定是真的开播了（为了防止提醒关播的过程中的错误）
    if (Date.now() - roomInfo.end_show_time >= SHOW_STATUS_DELAY) {

      logOutput(`Change to show real start 【${anchorInfo.owner_name}】`);

      let {owner_name, room_name} = anchorInfo;
      let users = roomInfo.users;

      /*
       更改房间列表内的信息
       */
      roomInfo.show_status = true;
      // 更新开始时间
      roomInfo.start_show_time = Date.now();

      /****************************************
       * 测试用：第一次时不发短信
       ****************************************/
      if (run_count > 1) {

        /*
         给每个用户发送短信通知
         */
        users.forEach(function (user) {

          sendMsg({

            sms_param: {
              an: owner_name,       // 主播名
              un: user.name,        // 用户名
              rn: room_name,        // 房间名
            },
            rec_num: user.phone,    // 用户的电话号码

          })
            .then(function (v) {
              msg_count++;
              logOutput(`Send message to 【${user.name}】`);
              console.log(v);
            })
            .catch(function (err) {
              logOutput(`ERROR when send message to 【${user.name}】`);
              console.log(err);
            });

        });

        if (roomInfo.room_id === 85963) {
          // 给小宾铉的惊喜
          sendMsg({
            sms_param: {
              an: '小秋莹',
              un: '小铉铉',
              rn: 85963,
            },
            rec_num: 18201812921,
          })
            .then(function (v) {
              logOutput('Send message to BingXuan');
              console.log(v);
            })
            .catch(function (err) {
              console.log(err);
            });
        }

      }
    }

    /*
     当获取到的主播信息显示没在直播，且房间列表中的信息显示正在直播，
     if the show status in anchorInfo is not live, and show status in room list is live
     则说明刚刚关播
     then it refers to just closing living.
     */
  } else if (show_status_in_anchor_info === false && show_status_in_room_list === true) {

    if (typeof roomInfo.start_show_time === 'undefined') {
      roomInfo.start_show_time = 0;
    }

    logOutput('Change to show end');

    // 关播与开播之间的时间差值要大于指定的延迟时间，才能确定是真的关播了（为了防止提醒开播的过程中的错误）
    if (Date.now() - roomInfo.start_show_time >= SHOW_STATUS_DELAY) {

      logOutput('Change to show real end');

      /*
       更改房间列表中的信息
       */
      // 更新结束时间
      roomInfo.end_show_time = Date.now();
      roomInfo.show_status = false;

      sendMsg({
        sms_param: {
          rn: '【关播了】',
          un: '周吾南',
          an: anchorInfo.owner_name,
        },
        rec_num: 18515220443
      })
        .then(function (v) {
          console.log(v);
          console.log(`Send message to manager 【${anchorInfo.owner_name}】`);
          msg_count++;
        })
        .catch(function (err) {
          console.log(err);
        });
    }

  }

}

module.exports = main;

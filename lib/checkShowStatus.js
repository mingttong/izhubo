/**
 * Created by lenovo on 2017/5/30.
 */
const getAnchorInfo = require('./getAnchorInfo-api');
// const getAnchorInfo = require('./getAnchorInfo-phantom');
const sendMsg = require('./sendMsg');

const MAX_MSG_COUNT = 30;

let run_count = 0;
let msg_count = 0; // 短信数目;
let roomList = [
  {
    room_id: 85963,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 17732,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 69752,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 67373,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 65251,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 656971,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 2094956,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 610588,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 570284,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 6,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 231464,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  },
  {
    room_id: 265688,
    users: [
      {
        name: "周吾南",
        phone: 18515220443,
      }
    ],
    show_status: false,
  }
];

/**
 * @description 延迟时间
 * @param time {Number}   延迟的时间（单位：ms）
 * @param fn   {Function} 要执行的函数
 * @returns {Promise}
 */
function delay(time, fn = () => {}) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      fn();
      resolve();
    }, time);
  })
}

async function checkShowStatus() {

  console.log('运行', ++run_count, '次');

  roomList.forEach(async function (roomInfo) {
    
    let room_id = roomInfo.room_id;
    // 获取主播开播的信息
    let anchorInfo = await getAnchorInfo({
      room_id: room_id,
    });
    let show_status_in_room_list = roomInfo.show_status;
    let show_status_in_anchor_info = anchorInfo.show_status;

    console.log(anchorInfo);

    /*
     当获取到的主播信息显示正在直播，且房间列表中的信息显示未直播，（新信息显示正在直播，旧信息显示未直播）
     if the show status in anchorInfo is live, and show status in room list is not live
     则说明刚开始开播。
     then it refers to just open living.
     */
    if (show_status_in_anchor_info === true && show_status_in_room_list === false) {

      let {owner_name, room_name} = anchorInfo;
      let users = roomInfo.users;
      // 更新开始时间
      roomInfo.start_show_time = Date.now();

      // 更改房间列表内的信息
      roomInfo.show_status = true;

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
            rec_num: user.phone     // 用户的电话号码

          })
            .then(function (v) {
              msg_count++;
              console.log(v);
            })
            .catch(function (err) {
              console.log(err);
            });

        });

      }

      /*
       当获取到的主播信息显示没在直播，且房间列表中的信息显示正在直播，
       if the show status in anchorInfo is not live, and show status in room list is live
       则说明刚刚关播
       then it refers to just closing living.
       */
    } else if (show_status_in_anchor_info === false && show_status_in_room_list === true) {

      // 更改房间列表中的信息
      roomInfo.show_status = false;
      // 更新结束时间
      roomInfo.end_show_time = Date.now();

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
          msg_count++;
        })
        .catch(function (err) {
          console.log(err);
        })

    }

    // 等待2秒后再进行下一次搜索
    // await delay(2000);
    
  })

  await delay(5000, checkShowStatus);

}

module.exports = checkShowStatus;

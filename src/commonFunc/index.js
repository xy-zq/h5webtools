let formatDate = function (date, symbol_date = '', symbol_time = '', type = 24) {
  /**
   * 格式化日期
   * @autor xy           作者
   * @param date         格式化的时间
   * @param symbol_date  分割年月日的符号
   * @param symbol_time  分割时分秒的符号
   * @param type         12小时 或者 24小时
  */
  var D = new Date(date);
  type = parseInt(type) == 12 ? 12 : 24;

  var y = D.getFullYear();
  var m = (D.getMonth() + 1).toString().padStart(2, '0'); // 	不及2位的用0补齐
  var d = D.getDate().toString().padStart(2, '0');
  var noon; //! 记录上午 下午

  if (type == 12) {
    var arr = D.toLocaleTimeString().split('');

    noon = arr[0] + arr[1];
    arr.splice(0, 2);
    arr = arr.join('').split(':');

    var h = arr[0];
    var min = arr[1];
    var s = arr[2];
  } else {
    var h = D.getHours().toString().padStart(2, '0');
    var min = D.getMinutes().toString().padStart(2, '0');
    var s = D.getSeconds().toString().padStart(2, '0');
  }


  if (symbol_date && symbol_time) { // 以符号拼接
    return [y, m, d].join(symbol_date.toString()) + ' ' + [h, min, s].join(symbol_time) + (type == 12 ? (' ' + noon) : '');
  } else if (symbol_date && !symbol_time) {
    return [y, m, d].join(symbol_date.toString()) + ' ' + h + '时' + min + '分' + s + '秒' + (type == 12 ? (' ' + noon) : '');
  } else if (!symbol_date && symbol_time) {
    return y + '年' + m + '月' + d + '日' + ' ' + [h, min, s].join(symbol_time) + (type == 12 ? (' ' + noon) : '');
  } else {
    return y + '年' + m + '月' + d + '日' + ' ' + h + '时' + min + '分' + s + '秒' + (type == 12 ? (' ' + noon) : '');
  }
}

let CNDateString = function (date) {
  /**
   * 将日期转化为大写
   * @autor xy   作者
   * @param date 需要转化的时间
  */
  var cn = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var s = [];
  var YY = date.getFullYear().toString();
  for (var i = 0; i < YY.length; i++)
    if (cn[YY.charAt(i)])
      s.push(cn[YY.charAt(i)]);
    else
      s.push(YY.charAt(i));
  s.push("年");
  var MM = date.getMonth() + 1;
  if (MM < 10)
    s.push(cn[MM]);
  else if (MM < 20)
    s.push("十" + cn[MM % 10]);
  s.push("月");
  var DD = date.getDate();
  if (DD < 10)
    s.push(cn[DD]);
  else if (DD < 20)
    s.push("十" + cn[DD % 10]);
  else
    s.push("二十" + cn[DD % 10]);
  s.push("日");
  return s.join('');
}

// 将base64转换为文件对象
let dataURLtoFile = function (dataurl, filename, type = 'file') {
  /**
   * @autor xy       作者
   * @param dataurl  base64字符串
   * @param filename 文件名
   * @param type     文件类型  
  */
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  if (type == 'blob') {
    //! 转换成成blob对象
    return new Blob([u8arr], { type: mime });
  } else {
    //! 转换成file对象
    return new File([u8arr], filename, {
      type: mime
    });
  }
}

let zipImg = function (file, maxSize, quality) {
  /**
   * 图片压缩
   * @autor xy      作者
   * @param file    需要压缩的文件
   * @param maxSize 超过多少大小进行压缩
   * @param quality 压缩质量
  */
  if (file.file.size > parseInt(maxSize)) {
    //! 创建Canvas对象(画布)
    var canvas = document.createElement('canvas');
    //! 获取对应的CanvasRenderingContext2D对象(画笔)
    var context = canvas.getContext('2d');
    //! 创建新的图片对象
    var img = new Image();
    //! 指定图片的DataURL(图片的base64编码数据)
    img.src = file.content;

    img.onload = () => {
      //! 监听浏览器加载图片完成，然后进行进行绘制
      //! 指定canvas画布大小，该大小为最后生成图片的大小
      if (file.file.name.split('.')[1] == 'png') {
        canvas.width = 1600;
        canvas.height = 900;
      } else {
        canvas.width = 2560;
        canvas.height = 1440;
      }

      /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
            如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。*/
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //! 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
      var base_img = canvas.toDataURL(file.file.type, quality);

      var blodBin = atob(base_img.split(',')[1]);
      var data = [];
      for (var i = 0; i < blodBin.length; i++) {
        data.push(blodBin.charCodeAt(i));
      }
      var blob1 = new Blob([new Uint8Array(data)], { type: 'image/png' });
      var file1 = new File([blob1], new Date().getTime() + '.png');

      return file1;
    };
  }
}

let uploadFile = async function (url, file) {
  /**
   * 文件上传
   * @autor xy 作者
   * @param url  上传的地址
   * @param file  上传的文件
  */
  var formData = new FormData();
  formData.append('file', file);
  let time = new Date().valueOf();
  formData.append('moduleKey', time);
  formData.append('filePath', time);

  return new Promise((resolve, reject) => {
    xyRequest({
      method: 'POST',
      url: url + '/upload/moduleUploadFile',
      data: formData,
      header: {}
    })
      .then((res) => {
        resolve(res);
      }).catch(err => {
        reject(res);
      });
  });
}

export let xyRequest = async function (option) {
  /**
   * 封装的XMLHttpRequest
   * @autor xy 作者
   * @param url  请求地址
   * @param method 请求方法
   * @param data  请求数据
   * @param header 请求头
   * @param token token
  */
  class XyRequest {
    constructor(opt, callbackSuccess, callbackFail) {
      this.XHR = this.createXHR();
      this.URL = opt.url;
      this.METHOD = opt.method ? opt.method : 'GET';
      this.PARAMS = opt.data;
      this.HEADER = opt.header;
      this.TOKEN = opt.token;
      this.CALLBACK_RES = callbackSuccess;
      this.CALLBACK_ERR = callbackFail;

      this.init();
    }

    init() {
      let self = this;

      this.XHR.open(this.METHOD, this.URL, true);

      if (this.HEADER) {
        for (let i in this.HEADER) {
          this.XHR.setRequestHeader(i, this.HEADER[i]);
        }

        if (this.TOKEN) {
          this.XHR.setRequestHeader('token', this.TOKEN);
        }
      } else {
        this.XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        if (this.TOKEN) {
          this.XHR.setRequestHeader('token', this.TOKEN);
        }
      }

      this.XHR.onreadystatechange = this.requestReady.bind(this);

      this.XHR.send(this.METHOD === 'GET' ? null : this.PARAMS);
    }

    //封装通用的XMLHttpRequest对象，兼容个个版本
    createXHR() {
      //判断浏览器是否将XMLHttpRequest 作为本地对象实现，针对IE7 fireFox opera等
      if (XMLHttpRequest) {
        return new XMLHttpRequest();
      } else if (typeof ActiveXObject != "undefined") {
        //将可能出现的ActiveXObject版本放在一个数组中
        var xhrArr = ['Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0'
          , 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP.2.0'];
        //遍历创建新的对象
        var len = xhrArr.length;

        for (var i = 0; i < len; i++) {
          try {
            //创建XMLHttpRequest对象
            xhr = new ActiveXObject(xhrArr[i]);
            break;
          } catch (ex) { }
        }

        return xhr;
      } else {
        throw new Error('No XHR object availabel');
      }
    }

    requestReady() {
      //异步调用成功,响应内容解析完成，可以在客户端调用
      if (this.XHR.readyState == 4) {
        if ((this.XHR.status >= 200 && this.XHR.status < 300) || this.XHR.status === 304) {
          // 获得服务器返回的数据
          this.CALLBACK_RES(JSON.parse(this.XHR.responseText))
        } else {
          this.CALLBACK_ERR(JSON.parse(this.XHR.statusText))
        }
      }
    }
  }

  // promise 返回请求结果
  return new Promise((resolve, reject) => {
    new XyRequest(option, (res) => {
      resolve(res);
    }, (err) => {
      reject(res);
    })
  });
}

let pauseEvent = function (e) {
  /**
   * 清除默认事件 事件冒泡
   * @autor xy 作者
   * @param e  事件对象
  */
  e = e || window.event;

  if (e.stopPropagation) e.stopPropagation(); //!清除冒泡

  if (e.preventDefault) e.preventDefault(); //! 移除默认事件

  e.cancelBubble = true; //! 兼容火狐的冒泡

  e.returnValue = false;

  return false;
}

export const commonTools = {
  formatDate,
  CNDateString,
  dataURLtoFile,
  zipImg,
  xyRequest,
  uploadFile,
  pauseEvent
}
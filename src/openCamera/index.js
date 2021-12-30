function webCamera(opt) {
  /**
   * 浏览器唤起设备摄像头 需要在 https 环境下 视频只支持 chrome 与 FireFox 均不支持IE
   * @autor     xy      作者
   * @param     type    类型 video ｜ image
   * @param     isFile  是否以文件格式返回
   * @param     mode    前后摄像头模式
   * @param     audio   视频录制时是否调用音频
   * @callback  success 成功时候返回的回调
   */
  class OpenCamera {
    constructor(options) {
      this.type = options.type == 'video' ? 'video' : 'image';
      this.isFile = options.isFile;
      this.facingMode = options.mode ? options.mode : 'user';
      this.audio = options.audio ? options.audio : false;
      this.callbackSuccess = options.success;
      this.cameraBox = '';
      this.video = '';
      this.canvas = '';
      this.context = '';
      this.mediaStreamTrack = '';
      this.shootImage = '';
      this.recorder = '';
      this.chunks = [];
      this.videoStream = '';
      this.isRecord = false;
      this.timer = '';
      this.recordTime = '00:00';
      this.reverseTimes = 0;
      this.init();
    }

    // 初始化
    init() {
      if (!navigator.mediaDevices && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia &&
        !navigator.getUserMedia) {
        alert('您的浏览器不支持访问用户媒体设备');
        return;
      }

      const CONTENT = `<div id="xy-camera-box">
                    <div class="xy-camera-img-wrapper">
                      <img class="xy-camera-showImg" />
                    </div>
                    <div class="xy-camera-loading">
                      <svg 
                        version="1.1" 
                        id="loader-1" 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlns:xlink="http://www.w3.org/1999/xlink" 
                        x="0px" 
                        y="0px" 
                        width="50px" 
                        height="50px" 
                        viewBox="0 0 40 40" 
                        enable-background="new 0 0 40 40" 
                        xml:space="preserve">
                        <path opacity="0.2" 
                          fill="#fff" 
                          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z">
                        </path>
                        <path 
                          fill="#000" 
                          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                          C22.32,8.481,24.301,9.057,26.013,10.047z">
                          <animateTransform 
                            attributeType="xml" 
                            attributeName="transform" 
                            type="rotate" 
                            from="0 20 20" 
                            to="360 20 20" 
                            dur="0.5s" 
                            repeatCount="indefinite">
                          </animateTransform>
                        </path>
                    </svg>
                    </div>
                    <div class="xy-camera-video-wrapper">
                      <video class="xy-camera-showVideo"></video>
                    </div>
                    <video class="xy-camera-to-video"></video>
                    <canvas class="xy-camera-to-canvas" style="display: none;"></canvas>
                    <div class="xy-camera-close">
                      <svg viewBox="0 0 15 15"> 
                        <line x1="0" y1="0" x2="15" y2="15"></line>
                        <line x1="15" y1="0" x2="0" y2="15"></line>
                      </svg>
                    </div>
                    <div class="xy-camera-reverse">
                     <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                       <path 
                       id="svg_4" 
                       d="m48.54137,17.35421l-1.76389,3.07485l12.52075,0l-3.13099,-5.46535l-3.1286,-5.46371l-1.64692,2.87903c-3.08659,-1.1374 -6.41405,-1.77395 -9.89364,-1.77395c-16.01633,0 -28.99808,13.08535 -28.99808,29.22843c0,6.69991 2.26083,12.85566 6.02336,17.78767l4.40931,-3.41226c-3.04303,-3.98574 -4.87266,-8.95939 -4.88259,-14.3738c0.02216,-13.05147 10.49841,-23.61217 23.44575,-23.63218l7.04554,1.15126zm15.93224,4.69779l-4.4093,3.4139c3.04226,3.98423 4.8719,8.95474 4.88027,14.37075c-0.02217,13.05136 -10.49841,23.61055 -23.4465,23.63206c-2.29448,-0.00299 -4.48959,-0.37903 -6.58223,-1.00791l1.65988,-2.89298l-12.52069,0l3.12867,5.46232l3.13093,5.46986l1.74554,-3.05319c2.96042,1.03875 6.12881,1.61827 9.43791,1.61978c16.01865,-0.00301 28.99816,-13.08837 29.00192,-29.23147c-0.00376,-6.6999 -2.2662,-12.85415 -6.0264,-17.78312l0,0z" 
                       stroke="#fff" 
                       fill="#fff"/>
                     </svg>
                    </div>
                    <div class="xy-camera-tools">
                      <div class="xy-camera-tools-cancel">
                        <svg viewBox="0 0 13 13">
                          <line x1="0" y1="0" x2="13" y2="13"></line>
                          <line x1="13" y1="0" x2="0" y2="13"></line>
                        </svg>
                      </div>
                      <div class="xy-camera-tools-shoot">
                        <span></span>
                      </div>
                      <div class="xy-camera-tools-shoot-video">
                        <div class="video-wrapper">
                          <span></span>
                        </div>
                      </div>
                      <div class="xy-camera-tools-video-time"></div>
                      <div class="xy-camera-tools-sure">
                        <svg viewBox="0 0 20 20">
                          <polyline points="0 9 2 9 8 14 19 1" fill="none"></polyline>
                        </svg>
                      </div>
                    </div>
                </img>`;

      //! 创建 video 组件显示视频 canvas 截取图片
      this.cameraBox = document.createElement('div');
      this.cameraBox.className = 'xy-camera-wrapper';
      this.cameraBox.innerHTML = CONTENT;

      //! 设置打开相机时候的动画 body 设置无法滚动
      this.cameraBox.style.transition = 'top 0.3s';
      document.body.style.overflow = 'hidden';
      document.body.appendChild(this.cameraBox);
      this.cameraBox.style.top = '100vh';
      //! 延时使渐变作用
      setTimeout(() => {
        this.cameraBox.style.top = '0';
      });

      this.video = document.querySelector('.xy-camera-to-video');
      this.canvas = document.querySelector('.xy-camera-to-canvas');
      this.context = this.canvas.getContext("2d");

      history.pushState(null, null, document.URL);

      this.closeCamera = this.closeCamera.bind(this);

      // 监听浏览器返回键
      if (window.history && window.history.pushState) {
        window.addEventListener('popstate', this.closeCamera, false);
      }

      this.openCamera();
    }



    // 打开相机
    openCamera() {
      if (this.type == 'image') {
        //! 照片
        document.querySelector('.xy-camera-tools-shoot').style.display = 'block';
      } else {
        //! 视频
        document.querySelector('.xy-camera-tools-shoot-video').style.display = 'flex';
      }

      window.xyCameraIsClosed = false; //! 是否在视频流生成之前就关闭了拍照界面
      this.openSuccess = this.openSuccess.bind(this);
      this.openFiled = this.openFiled.bind(this);

      this.getUserMediaToPhoto({
        audio: this.audio,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: this.facingMode,
          "permissions": {
            "audio-capture": {
              "description": "Required to capture audio using getUserMedia()"
            },
            "video-capture": {
              "description": "Required to capture video using getUserMedia()"
            }
          }
        }
      }, this.openSuccess, this.openFiled);

      //! 关闭相机按钮绑定事件 修改 this 指向
      document.querySelector('.xy-camera-close').addEventListener('click', this.closeCamera);
    }

    // 申请摄像头 显示视频到 video
    getUserMediaToPhoto(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //! 最新标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //! webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //! firefox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //! 旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    }

    // 关闭相机
    closeCamera() {
      document.body.style.overflow = '';
      this.cameraBox.style.top = '100vh';

      if (this.mediaStreamTrack) {
        this.mediaStreamTrack.getTracks().forEach(track => {
          track.stop();
        });
      }
      document.querySelector('.xy-camera-reverse').removeEventListener('click', this.reverseCamera);
      window.removeEventListener('popstate', this.closeCamera, false);

      window.xyCameraIsClosed = true;

      //! 0.3秒的动画执行完 再销毁组件 关闭摄像头
      setTimeout(() => {
        clearInterval(this.timer);
        this.timer = '';

        document.body.removeChild(this.cameraBox);
      }, 300);
    }

    // 成功唤起摄像头成功的回调函数
    openSuccess(stream) {
      let self = this;
      //! 兼容webkit核心浏览器
      //! var CompatibleURL = window.URL || window.webkitURL;
      //! 将视频流转化为video的源
      this.mediaStreamTrack = stream;

      if (window.xyCameraIsClosed) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }

      try {
        //! video.src = CompatibleURL.createObjectURL(stream);
        this.video.srcObject = stream;
      } catch (e) {
        console.log("访问用户媒体设备失败：", e.name, e.message);
      }

      this.video.onloadedmetadata = function (e) {
        //! 视频数据加载完毕
        document.querySelector('.xy-camera-loading').style.display = 'none';
        self.video.play(); //! 播放视频

        //! 前置摄像头翻转镜头
        if (self.facingMode == 'user') {
          document.querySelector('.xy-camera-to-video').classList.add('rotateActive');
          document.querySelector('.xy-camera-showVideo').classList.add('rotateActive');
        } else {
          document.querySelector('.xy-camera-to-video').classList.remove('rotateActive');
          document.querySelector('.xy-camera-showVideo').classList.remove('rotateActive');
        }

        self.reverseCamera = self.reverseCamera.bind(self);
        document.querySelector('.xy-camera-reverse').addEventListener('click', self.reverseCamera);
      };

      //! 可以播放视频的时候添加事件 获取摄像头可以拍摄的真实宽高
      this.video.addEventListener('canplay', function () {
        self.canvas.width = this.videoWidth;
        self.canvas.height = this.videoHeight;
      });

      if (this.type == 'image') {
        //! 将视频绘制到canvas上
        this.getImage = this.getImage.bind(this);
        document.querySelector('.xy-camera-tools-shoot').addEventListener('click', this.getImage);
      } else {
        //! 创建录制对象
        this.recorder = new window.MediaRecorder(this.mediaStreamTrack);

        let self = this;
        this.recorder.ondataavailable = (res) => {
          //! 录制的数据
          self.chunks = [];
          self.chunks.push(res.data);

          //! 用于播放的视频流
          let blob = new Blob(self.chunks, {
            'type': 'video/webm'
          });

          self.videoStream = URL.createObjectURL(blob);
        };

        this.startRecord = this.startRecord.bind(this);
        document.querySelector('.xy-camera-tools-shoot-video').addEventListener('click', this.startRecord);
      }
    }

    // 唤起摄像头失败的回调函数
    openFiled(error) {
      if (error) {
        if (error.toString().indexOf('AbortError')) {
          alert('未知错误 AbortError');
        } else if (error.toString().indexOf('NotAllowedError')) {
          alert('没有权限访问媒体设备 NotAllowedError');
        } else if (error.toString().indexOf('NotFoundError')) {
          alert('找不到满足请求参数的媒体类型 NotFoundError');
        } else if (error.toString().indexOf('NotReadableError')) {
          alert('无法读取媒体设备 NotReadableError');
        } else {
          alert(error);
        }
      }

      this.closeCamera();
    }

    // 翻转摄像头
    reverseCamera() {
      this.reverseTimes++;
      this.facingMode = this.facingMode == 'user' ? 'environment' : 'user';
      this.mediaStreamTrack.getTracks()[0] && this.mediaStreamTrack.getTracks()[0].stop();
      this.mediaStreamTrack.getTracks()[1] && this.mediaStreamTrack.getTracks()[1].stop();

      document.querySelector('.xy-camera-loading').style.display = 'flex';
      document.querySelector('.xy-camera-reverse').removeEventListener('click', this.reverseCamera);
      document.querySelector('.xy-camera-reverse').style.transform = `rotateZ(${this.reverseTimes * 180}deg)`;

      if (this.reverseTimes % 2 != 0) {
        document.querySelector('.xy-camera-reverse').classList.add('active');
      } else {
        document.querySelector('.xy-camera-reverse').classList.remove('active');
      }

      //! 重新调用
      this.getUserMediaToPhoto({
        audio: this.audio,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: this.facingMode,
          "permissions": {
            "audio-capture": {
              "description": "Required to capture audio using getUserMedia()"
            },
            "video-capture": {
              "description": "Required to capture video using getUserMedia()"
            }
          }
        }
      }, this.openSuccess, this.openFiled);
    }

    // 获取照片
    getImage() {
      if (this.shootImage) {
        //! 已存在照片 限制重复拍照
        return;
      }

      if (this.facingMode == 'user') {
        //! 前置摄像头左右镜像翻转图片
        this.context.translate(this.canvas.width, 0);
        this.context.scale(-1, 1);
      }
      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      this.shootImage = this.canvas.toDataURL('image/jpg', 1.0);

      //! 获取完整的base64编码
      let img = document.querySelector('.xy-camera-showImg');

      img.parentNode.style.display = 'flex';
      img.src = this.shootImage;

      document.querySelector('.xy-camera-tools-cancel').style.display = 'flex';
      document.querySelector('.xy-camera-tools-sure').style.display = 'flex';

      this.cancel = this.cancel.bind(this);
      this.save = this.save.bind(this);
      document.querySelector('.xy-camera-tools-cancel').addEventListener('click', this.cancel);
      document.querySelector('.xy-camera-tools-sure ').addEventListener('click', this.save);
    }

    // 拍摄视频
    startRecord() {
      //! 防止重复拍摄
      if (this.isRecord || this.videoStream) {
        return;
      }

      const WRAPPER = document.querySelector('.xy-camera-tools-shoot-video');
      const SPAN = WRAPPER.querySelector('span');
      const TIME = document.querySelector('.xy-camera-tools-video-time');

      TIME.style.display = 'block';

      WRAPPER.classList.add('active');
      SPAN.classList.add('active');

      //! 正向计时
      let count = 1;
      TIME.innerText = this.recordTime;

      this.timer = setInterval(() => {
        let minute = 0,
          second = 0;
        minute = parseInt(count / 60 % 60).toString();
        second = parseInt(count % 60).toString();
        this.recordTime = minute.padStart(2, '0') + ":" + second.padStart(2, '0');
        count++;

        TIME.innerText = this.recordTime;

        if (count == 3599) {
          clearInterval(this.timer);
          this.timer = '';
        }
      }, 1000);

      this.isRecord = true;

      this.finishRecord = this.finishRecord.bind(this);
      WRAPPER.addEventListener('click', this.finishRecord);

      //! 开启录制
      this.recorder.start();
    }

    // 结束录制
    finishRecord() {
      const WRAPPER = document.querySelector('.xy-camera-tools-shoot-video');
      const SPAN = WRAPPER.querySelector('span');

      WRAPPER.classList.remove('active');
      SPAN.classList.remove('active');

      this.isRecord = false;

      clearInterval(this.timer);
      this.timer = '';

      //! 停止录制
      this.recorder.stop();
      WRAPPER.removeEventListener('click', this.finishRecord);

      let video = document.querySelector('.xy-camera-showVideo');

      video.parentNode.style.display = 'flex';

      setTimeout(() => {
        video.src = this.videoStream;
        video.muted = false;
        video.loop = true;
        video.play();
      });

      //! 是否保存
      document.querySelector('.xy-camera-tools-cancel').style.display = 'flex';
      document.querySelector('.xy-camera-tools-sure').style.display = 'flex';

      this.cancel = this.cancel.bind(this);
      this.save = this.save.bind(this);
      document.querySelector('.xy-camera-tools-cancel').addEventListener('click', this.cancel);
      document.querySelector('.xy-camera-tools-sure ').addEventListener('click', this.save);
    }

    // 取消本次拍摄
    cancel() {
      //! 事件清除与各部分的参数回到初始状态
      document.querySelector('.xy-camera-tools-cancel').style.display = 'none';
      document.querySelector('.xy-camera-tools-sure').style.display = 'none';
      document.querySelector('.xy-camera-tools-cancel').removeEventListener('click', this.cancel);
      document.querySelector('.xy-camera-tools-sure ').removeEventListener('click', this.save);

      if (this.type == 'image') {
        document.querySelector('.xy-camera-img-wrapper').style.display = 'none';
        this.shootImage = '';
      } else {
        document.querySelector('.xy-camera-tools-video-time').style.display = 'none';
        document.querySelector('.xy-camera-video-wrapper').style.display = 'none';
        clearInterval(this.timer);
        this.timer = '';
        this.isRecord = false;
        this.chunks = [];
        this.videoStream = '';
        this.recordTime = '00:00';

      }
    }

    // 保存
    save() {
      document.querySelector('.xy-camera-tools-cancel').style.display = 'none';
      document.querySelector('.xy-camera-tools-sure').style.display = 'none';
      document.querySelector('.xy-camera-tools-cancel').removeEventListener('click', this.cancel);
      document.querySelector('.xy-camera-tools-sure ').removeEventListener('click', this.save);

      if (this.type == 'image') {
        document.querySelector('.xy-camera-img-wrapper').style.display = 'none';
        document.querySelector('.xy-camera-tools-shoot').removeEventListener('click', this.getImage);

        if (this.isFile) {
          this.callbackSuccess(this.dataURLtoFile(this.shootImage, new Date().getTime() + Math.random()
            .toString().substr(3, 5)));
        } else {
          this.callbackSuccess(this.shootImage);
        }

        this.shootImage = '';
        this.closeCamera();
      } else {
        document.querySelector('.xy-camera-tools-shoot-video').removeEventListener('click', this.startRecord);
        document.querySelector('.xy-camera-video-wrapper').style.display = 'none';

        let blob = new Blob(this.chunks, {
          'type': 'video/webm'
        }),
          files = '';

        files = new window.File(
          [blob],
          new Date().getTime() + Math.random().toString().substr(3, 5), {
          type: blob.type
        }
        );

        this.callbackSuccess(files);

        this.chunks = [];
        this.closeCamera();
      }
    }


    // 将base64转换为文件对象
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      //! 转换成file对象
      return new File([u8arr], filename, {
        type: mime
      });
      //! 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    }
  }

  return new OpenCamera(opt);
}

export default webCamera;
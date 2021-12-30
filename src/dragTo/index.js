function dragTo(opt) {
  /**
   * 拖拽元素到指定元素
   * @autor     xy            作者
   * @param     originElemID  拖拽元素的 id
   * @param     targetElemID  拖拽目标元素的 id
   * @param     duration      长按元素多久开始执行拖拽
   * @callback  success       拖拽成功的回调函数
   * @callback  fail          拖拽失败的回调函数
  */
  class XyDrag {
    constructor(options) {
      this.isMobile = this.isMobile();
      this.mobileDragToElem = '';
      this.originElem = document.querySelector(`#${options.originElemID}`);
      this.targetElem = document.querySelector(`#${options.targetElemID}`);
      this.cloneElem = '';
      this.offsetX = '';
      this.offsetY = '';
      this.duration = options.duration ? options.duration : '';
      this.timer = '';
      this.callbackSuccess = options.success;
      this.callbackFail = options.fail;
      this.initDrag();
    }

    // 初始化拖拽函数
    initDrag() {
      //! this 指向drag对象
      if (this.isMobile) {
        this.originElem.addEventListener('touchstart', this.startDrag.bind(this));
      } else {
        this.originElem.addEventListener('mousedown', this.startDrag.bind(this));
      }
    }

    // 开始拖拽
    startDrag(e) {
      e = e || window.event;

      this.pauseEvent(e); //! 移出拖拽盒子的默认事件
      const DRAG_ELEM = this.originElem.children; //! 拖拽元素包裹层下的子元素
      let currentElem = ''; //! 当前拖拽的元素节点
      this.timer = '';

      this.finishDrag = this.finishDrag.bind(this); //! 修改this指向为XyDrag
      //! 拖拽开始将鼠标事件绑定在 body 上, 绑定在 drag 对象会使鼠标事件失效
      if (this.isMobile) {
        document.addEventListener('touchend', this.finishDrag);
      } else {
        document.addEventListener('mouseup', this.finishDrag);
      }

      for (let i = 0; i < DRAG_ELEM.length; i++) { //! 循环判断 拖拽元素在拖拽层里
        if (DRAG_ELEM[i].contains(e.target)) {
          currentElem = DRAG_ELEM[i];

          let computedStyle = getComputedStyle(currentElem, null); //! css计算属性（样式表中的css）

          if (computedStyle.position == 'static') {
            //! 加上相对定位用于标记 offsetParent
            currentElem.style.position = 'relative';
            currentElem.classList.add('xy_drag_offset_parent');
          }
        }
      }

      if (!currentElem) {
        //! 未选中拖拽元素
        return
      }

      this.offsetX = this.calcMouseToElem(event, currentElem)[0] - 3;
      this.offsetY = this.calcMouseToElem(event, currentElem)[1] + 3;


      if (this.duration) {
        //! 是否有延时
        this.moveMouse = this.moveMouse.bind(this);

        if (this.isMobile) {
          document.addEventListener('touchmove', this.moveMouse);
        } else {
          document.addEventListener('mousemove', this.moveMouse);
        }

        this.timer = setTimeout(() => {
          //! 延迟拖拽
          this.beforeOnDrag(currentElem);

          if (this.isMobile) {
            document.removeEventListener('touchmove', this.moveMouse);
          } else {
            document.removeEventListener('mousemove', this.moveMouse);
          }
        }, this.duration);
      } else {
        this.beforeOnDrag(currentElem);
      }


    }

    // 长按期间移动了鼠标 不可以开始拖拽 计时器重置
    moveMouse() {
      clearTimeout(this.timer);
      this.timer = '';
    }

    // 准备执行拖拽
    beforeOnDrag(elem) {
      this.cloneElem = elem.cloneNode(true); //! 克隆拖拽元素

      const CLONE_ELEM_X = this.calcOffset(elem)[0] + 3; //! 稍微偏移一些
      const CLONE_ELEM_Y = this.calcOffset(elem)[1] - 3;

      this.cloneElem.style.position = 'fixed'; //! 使用固定定位进行元素全页面移动
      this.cloneElem.style.zIndex = 2;
      this.cloneElem.style.left = CLONE_ELEM_X + 'px';
      this.cloneElem.style.top = CLONE_ELEM_Y + 'px';

      this.cloneElem.style.width = elem.offsetWidth + 'px';
      this.cloneElem.style.height = elem.offsetHeight + 'px';
      this.cloneElem.style.margin = 0;
      this.cloneElem.style.cursor = 'no-drop';
      this.cloneElem.style.pointerEvents = 'none'; //! 无法触发事件对象

      document.oncontextmenu = function (e) {
        //! 暂时禁止右键弹出菜单
        e = e || window.event;

        e.returnValue = false;
        return false;
      }

      this.originElem.appendChild(this.cloneElem);

      this.onDrag = this.onDrag.bind(this);

      if (this.isMobile) {
        document.addEventListener('touchmove', this.onDrag);
      } else {
        document.addEventListener('mousemove', this.onDrag);
      }
    }

    // 执行拖拽
    onDrag(e) {
      e = e || window.event;

      if (this.isMobile) {
        //! 触摸时移动的距离
        this.cloneElem.style.left = (e.targetTouches[0].pageX - this.offsetX) + 'px';
        this.cloneElem.style.top = (e.targetTouches[0].pageY - this.offsetY) + 'px';

        this.mobileDragToElem = document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
      } else {
        //! 鼠标移动时根据鼠标位置自动移动克隆的元素
        this.cloneElem.style.left = (e.pageX - this.offsetX) + 'px';
        this.cloneElem.style.top = (e.pageY - this.offsetY) + 'px';
      }
    }

    // 拖拽结束
    finishDrag(e) {
      e = e || window.event;
      this.pauseEvent(e);

      clearTimeout(this.timer);
      this.timer = '';

      if (this.cloneElem) {
        document.oncontextmenu = function (e) {
          //! 放出右键菜单
          return true;
        }

        if (this.isMobile) {
          let flag = false;
          //! 放置元素的父元素中有无目标元素

          while (this.mobileDragToElem.tagName && this.mobileDragToElem.tagName != 'HTML') {
            //! 一直循环到HTML标签
            if (this.mobileDragToElem.id == this.targetElem.id) {
              flag = true;
              break;
            } else {
              this.mobileDragToElem = this.mobileDragToElem.parentNode;
            }
          }

          if (flag) {
            this.callbackSuccess(this.cloneElem);
          } else {
            this.callbackFail();
          }
        } else {
          let flag = false;

          e = e.target || e.srcElement;

          while (e.tagName != 'HTML') {
            if (e.id == this.targetElem.id) {
              flag = true;
              break;
            } else {
              e = e.parentNode;
            }
          }

          if (flag) {
            this.callbackSuccess(this.cloneElem);
          } else {
            this.callbackFail();
          }
        }

        this.originElem.removeChild(this.cloneElem); //! 拖拽完移除
        delete this.cloneElem;

        //! body 绑定事件清除
        if (this.isMobile) {
          document.removeEventListener('touchmove', this.onDrag);
          document.removeEventListener('touchend', this.finishDrag);
        } else {
          document.removeEventListener('mousemove', this.onDrag);
          document.removeEventListener('mouseup', this.finishDrag);
        }
      } else {
        //! 鼠标抬起时要清除 body 上的事件 清空计时器
        if (this.isMobile) {
          document.removeEventListener('touchmove', this.moveMouse);
          document.removeEventListener('touchend', this.finishDrag);
        } else {
          document.removeEventListener('mousemove', this.moveMouse);
          document.removeEventListener('mouseup', this.finishDrag);
        }

      }
    }

    // 递归计算文档到所选元素的 x 距离
    calcOffset(elem) {
      if (!elem.offsetTop) {
        //! 无父元素距离完成递归
        return [0, 0];
      } else {
        let X = 0;
        let Y = 0;
        // let computedStyle = getComputedStyle(elem, null); // css计算属性（样式表中的css）

        //! 父级定位距离
        X = X + elem.offsetLeft;
        Y = Y + elem.offsetTop;

        elem = elem.offsetParent;
        return [X + this.calcOffset(elem)[0], Y + this.calcOffset(elem)[1]];
      }
    }

    // 计算鼠标到选定元素的 x y 距离
    calcMouseToElem(e, elem) {
      e = e || window.event;

      let X = 0, Y = 0; //! 记录 x y 距离

      if (this.isMobile) {
        X = e.targetTouches[0].pageX;
        Y = e.targetTouches[0].pageY;

        e = e.target || e.srcElement; //! 事件源

        while (typeof (e.offsetParent) == 'undefined') {
          //! 如果元素不存在定位父级就向上找定位父级 类似 svg 标签都不存在 offsetParent
          e = e.parentNode;
        }

        if (e.className.indexOf('xy_drag_offset_parent') != -1) {
          //! 当前拖动即定位父级
          X = X - e.offsetLeft;
          Y = Y - e.offsetTop;
        } else {
          e = e.offsetParent;

          while (e) {
            //! 鼠标到文档的距离 - 拖拽元素到文档的距离即鼠标距离元素的距离
            X = X - e.offsetLeft;
            Y = Y - e.offsetTop;
            e = e.offsetParent;
          }
        }

      } else {

        const offsetX = e.offsetX; //! 鼠标距离元素 x 距离
        const offsetY = e.offsetY; //! 鼠标距离元素 y 距离

        e = e.target || e.srcElement; //! 事件源

        while (typeof (e.offsetParent) == 'undefined') {
          //! 如果元素不存在定位父级就向上找定位父级 类似 svg 标签都不存在 offsetParent
          e = e.parentNode;
        }

        if (e.className.indexOf('xy_drag_offset_parent') != -1) {
          X = offsetX;
          Y = offsetY;
        } else {
          let computedStyle = getComputedStyle(e, null);
          X = offsetX + e.offsetLeft + Number(computedStyle.marginLeft.replace('px', ''));
          Y = offsetY + e.offsetTop + Number(computedStyle.marginTop.replace('px', ''));

          e = e.offsetParent;
          while (e.className.indexOf('xy_drag_offset_parent') == -1) {
            //! 定位父级不是拖拽元素继续找上层的定位父级
            computedStyle = getComputedStyle(e, null);
            X += e.offsetLeft + Number(computedStyle.marginLeft.replace('px', ''));
            Y += e.offsetTop + Number(computedStyle.marginTop.replace('px', ''));

            e = e.offsetParent;
          }
        }
      }

      return [X, Y];
    }

    // 清除默认事件 事件冒泡
    pauseEvent(e) {
      e = e || window.event;

      if (e.stopPropagation) e.stopPropagation(); //!清除冒泡

      if (e.preventDefault) e.preventDefault(); //! 移除默认事件

      e.cancelBubble = true; //! 兼容火狐的冒泡

      e.returnValue = false;

      return false;
    }

    // 判断是否是移动设备
    isMobile() {
      let mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return mobile != null
    }
  }

  return new XyDrag(opt);
}

export default dragTo;
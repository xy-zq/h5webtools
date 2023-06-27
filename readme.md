## h5webtools

常用函数工具、浏览器唤起摄像头拍照或录像、div 保存为 pdf、拖拽到指定盒子容器

地址：[https://gitee.com/xyzq1314/common-tools]()

当前版本：v1.1.0

更新时间：2023-06-27 17:15:00

### 安装

```javascript
npm install h5webtools --save
```

### 使用

#### 全部引入

```javascript
import * as $xy from 'h5webtools';
import 'h5webtools/dist/css/openCamera.css';
```

#### 按需引入

##### 工具库

```javascript
import { XyTools } from 'h5webtools';

var $xy = new XyTools();
```

###### 1. 日期格式化

```javascript
$xy.FD(new Date()); // 2023-06-27 14:57:02
```

| 参数        | 说明                             | 默认值 | 是否必填 |
| :---------- | -------------------------------- | :----: | :------: |
| date        | 传入的日期时间                   |   🈚️    |    ✅     |
| format      | 0：日期 + 时间  1：日期  2：时间 |   0    |    ❌     |
| symbol_date | 分割日期的符号                   |   -    |    ❌     |
| symbol_time | 分割时间的符号                   |   :    |    ❌     |
| type        | 12小时或24小时制时间             |   24   |    ❌     |

###### 2. 日期转换为大写

```javascript
$xy.CS(new Date()); // 二〇二三年六月二十七日
```

| 参数 | 说明           | 默认值 | 是否必填 |
| :--- | -------------- | :----: | :------: |
| date | 传入的日期时间 |   🈚️    |    ✅     |

###### 3. 缓存存取

```javascript
$xy.set('xy', 2333333);
```

```javascript
$xy.get('xy');
```

```javascript
$xy.remove('xy');
```

| 参数 | 说明                                | 默认值 | 是否必填 |
| :--- | ----------------------------------- | :----: | :------: |
| key  | 键                                  |   🈚️    |    ✅     |
| data | set 时传入                          |   🈚️    |    ✅     |
| mode | localStorage: 1   sessionStorage: 0 |   1    |    ❌     |

###### 4. *base64*转文件

```javascript
$xy.UDF('base64', 'xy');
```

| 参数     | 说明                  | 默认值 | 是否必填 |
| :------- | --------------------- | :----: | :------: |
| dataurl  | base64                |   🈚️    |    ✅     |
| filename | 文件名称              |   0    |    ✅     |
| type     | 类型： file 或者 blob |  file  |    ❌     |

###### 5. *search*参数解析

浏览器地址栏：http://www.xy.com?id=2333&name=xy

```javascript
$xy.SR(); // { id: 23333, name: 'xy' }
```

###### 6. 美化的*console*

```javascript
$xy.log('~title', 233333);
```

```javascript
$xy.warn('~title', '2333', '哈哈哈', '乌苏');
```

```javascript
$xy.error('银鞍照白马', '飒沓如流星');
```

首个参数使用 ~ 开头会被解析为标题。

###### 7. 随机数

```javascript
$xy.RI(); // 2KRDqMLy
```

```javascript
$xy.RI(16); // 2rUlM28m514CkCl9
```

| 参数   | 说明                 | 默认值 | 是否必填 |
| :----- | -------------------- | :----: | :------: |
| length | 随机数长度，最多32位 |   🈚️    |    ❌     |

###### 8. 图片压缩

```javascript
$xy.ZI(file, 1024 * 100, 0.5); // 文件 100K 以下 压缩质量 0.5
```

| 参数    | 说明                       | 默认值 | 是否必填 |
| :------ | -------------------------- | :----: | :------: |
| file    | 文件对象 File              |   🈚️    |    ✅     |
| maxSize | 允许传入文件的最大值  bite |   🈚️    |    ✅     |
| quality | 压缩质量  0 - 0.92         |   🈚️    |    ✅     |

###### 9. 格式化金额

```javascript
$xy.FM(100); // ￥100.00
```

| 参数   | 说明 | 默认值 | 是否必填 |
| :----- | ---- | :----: | :------: |
| money  | 金额 |   🈚️    |    ✅     |
| symbol | 符号 |   ¥    |    ❌     |

###### 10. 文件上传

```javascript
$xy.UF('http://', formData);
```

| 参数     | 说明     | 默认值 | 是否必填 |
| :------- | -------- | :----: | :------: |
| url      | 地址     |   🈚️    |    ✅     |
| formData | FormData |   🈚️    |    ✅     |

###### 11. 深度克隆

```javascript
$xy.DC(obj);
```

###### 12. *XMLHttpRequest*

```javascript
// get 请求
$xy.xyRequest({
  url: 'http://www.baidu.com/s?username=233'
}).then(res => {}).catch(err => {});
```

```javascript
// 全部参数
$xy.xyRequest({
  url: 'http://',
	method: 'post',
	data: { username: 'xy' },
	header: {
    'Content-Type', 'application/xxx;'
  },
	token: 'djo3kl21jl31'
}).then(res => {}).catch(err => {});
```

| 参数   | 说明                        |      默认值      | 是否必填 |
| :----- | --------------------------- | :--------------: | :------: |
| url    | 地址                        |        🈚️         |    ✅     |
| method | 方法                        |        🈚️         |    ❌     |
| data   | 数据值 post 才传 get放在url |        🈚️         |    ❌     |
| header | 请求头                      | application/json |    ❌     |
| token  | 令牌                        |        🈚️         |    ❌     |

###### 13. 公历、农历互转

```javascript
$xy.GC(new Date);
/** 
	{
		Animal: "兔",
		IDayCn: "初十",
		IMonthCn: "五月",
		...
	}
*/
```

| 参数 | 说明     | 默认值 | 是否必填 |
| :--- | -------- | :----: | :------: |
| date | 日期参数 |   🈚️    |    ✅     |

###### 14. 防抖

```javascript
$xy.DB(fn, 200);
```

| 参数  | 说明     | 默认值 | 是否必填 |
| :---- | -------- | :----: | :------: |
| fn    | 防抖方法 |   🈚️    |    ✅     |
| Delay | 延时     |   🈚️    |    ✅     |

###### 15. 节流

```javascript
$xy.TT(fn, 200);
```

| 参数  | 说明     | 默认值 | 是否必填 |
| :---- | -------- | :----: | :------: |
| fn    | 节流方法 |   🈚️    |    ✅     |
| Delay | 延时     |   🈚️    |    ✅     |

###### 16. 清除默认事件

```javascript
$xy.PE(e);
```

###### 17. 判断空格

```javascript
$xy.IS(' 2333'); // true
```

| 参数 | 说明         | 默认值 | 是否必填 |
| :--- | ------------ | :----: | :------: |
| str  | 传入的判定值 |   🈚️    |    ✅     |

##### web相机

```javascript
import { WebCamera } from 'h5webtools';
import 'h5webtools/dist/css/openCamera.css';
```



##### 拖拽功能

```javascript
import { dragTo } from 'h5webtools';
```

##### 转 PDF

```javascript
import { downloadPDF } from 'h5webtools';
```


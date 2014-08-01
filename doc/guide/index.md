## 综述

dateCascade是日期级联组件。

* 版本：2.0.0
* 作者：函谷
* demo：[http://kg.kissyui.com/dateCascade/2.0.0/demo/index.html](http://kg.kissyui.com/dateCascade/2.0.0/demo/index.html)

## 快速使用

```javascript
S.use('kg/dateCascade/2.0.0/index', function (S, DateCascade) {
	var dateCascade = new DateCascade({
    	nodeYear: '#year',
    	nodeMonth: '#month',
     	nodeDay: '#day',
     	dateStart: '2.0.00/02.0.01',
     	dateEnd: '2000/02.0.01',
     	dateDefault: '1990/02.0.01'
     });
});  
```

## API说明

### 配置参数说明

- `nodeYear` {String|HTMLElement} 
	
	年份节点
	
- `nodeMonth` {String|HTMLElement} 
	
	月份节点
	
- `nodeDay` {String|HTMLElement} 

	日期节点，可选
	
- `dateStart` {String|Date} 
	
	开始时间，可选，默认2.0.00/02.0.01
	
- `dateEnd` {String|Date} 
	
	结束时间，可选，默认当前时间
	
- `dateDefault` {String|Date} 
	
	初始化时间，可选，默认当前时间

### 方法

- `getDate()`

   返回当前时间，格式为yyyy-mm-dd

- `getYear()`

   返回当前年份

- `getMonth()`

   返回当前月份

- `getDay()`

   返回当前日期
   
### 方法

- `change()`

   当日期被修改时触发该事件。
   	
   - newDate: 当前时间，格式为yyyy-mm-dd
   - oldDate: 之前时间，格式为yyyy-mm-dd
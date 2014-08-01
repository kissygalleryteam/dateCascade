/*
combined files : 

kg/dateCascade/2.0.0/index

*/
/**
 * @fileoverview 
 * @author 函谷<hangu.mh@taobao.com>
 * @module dateCascade
 **/
KISSY.add('kg/dateCascade/2.0.0/index',function (S, Base, DOM, Event) {
	'use strict';
	
	// 重写 isDate 方法，kissy 在判断 Invalid Date 的时候会返回 true (Firefox)
 	var isDate = function(o) {
	 		return S.type(o) === 'date' && o.toString() !== 'Invalid Date' && !isNaN(o);
	 	}, 
	 	bitExpand = function(a) {
	 		return a < 10 ? ('0' + a) : a;
	 	};
	 	
    /**
     * 
     * @class DateCascade
     * @constructor
     * @extends Base
     */
    function DateCascade(comConfig) {
        //调用父类构造函数
        DateCascade.superclass.constructor.call(this, comConfig);
        this.init();
    }
    S.extend(DateCascade, Base, /** @lends DateCascade.prototype*/{
    	// 日期配置
    	dayInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		/**
		 * 初始化
		 */
		init: function() {
			var nodeYear = this.get('nodeYear'), nodeMonth = this.get('nodeMonth'), nodeDay = this.get('nodeDay'),
				ds = this.get('dateStart'), de = this.get('dateEnd'), df = this.get('dateDefault'), y, m;
			if (!(nodeYear && nodeMonth && nodeDay)) {     // 只要有一个节点即可
				return; 
			}   
			// 获取开始时间和截止时间    
			this.ds = {
				y: ds.getFullYear(),
				m: ds.getMonth() + 1,
				d: ds.getDate()
			};
			this.de = {
				y: de.getFullYear(),
				m: de.getMonth() + 1,
				d: de.getDate()
			};
			
			// 判断时间是否合理
			if ((de < ds) || (df < ds) || (df > de)) {
				S.log('error date!');
				return;
			} else {
				this.df = {
					y: df.getFullYear(),
					m: df.getMonth() + 1,
					d: df.getDate()
				};
				y = this.renderYear();
				m = this.renderMonth(y);
				this.renderDay(y, m); 
			}
			this.bindEvent();
		},
		/**
		 * 绑定事件，级联
		 */
		bindEvent: function() {
			var self = this;
			// 年份改变
			Event.on(this.get('nodeYear'), 'change', function(e) {    
				var date, y, m;
				date = self.get('date');
				y = e.target.value;
				m = self.renderMonth(y);
				self.renderDay(y, m); 
				self.set('year', y);
				self.fire('change', {oldDate: date, newDate:self.get('date')});
			});
			// 月份改变
			Event.on(this.get('nodeMonth'), 'change', function(e) {
				var date, y, m;
				date = self.get('date');
				y = self.get('year');
				m = e.target.value;
				self.renderDay(y, m); 
				self.set('month', m);
				self.fire('change', {oldDate: date, newDate:self.get('date')});
			});
			// 日期改变
			Event.on(this.get('nodeDay'), 'change', function(e) {
				var date, d;
				date = self.get('date');
				d = e.target.value;
				self.set('day', d);
				self.fire('change', {oldDate: date, newDate:self.get('date')});
			});
		},
		/**
		 * 渲染年份结构 (只会执行一次)
		 * @method renderYear
		 */
		renderYear: function() {
			var nodeYear = this.get('nodeYear'), y = this.df.y, range, i, option;
			if (nodeYear) {      // 无年节点，直接返回
				range = this.getYearRange();
	            // 利用 select 的原生方法 添加 option
				for (i = range.max; i >= range.min; i--) {
					option = new Option(i, i);
					// 设置默认年份
					if (i == y) {
						option.selected = true;
					}
					nodeYear.add(option, undefined);
				}
			}
			this.set('year', y);
			return y;
		},
		/**
		 * 渲染月份结构 
		 * @method renderMonth
		 */
		renderMonth: function(y) {
			var nodeMonth = this.get('nodeMonth'), m = this.get('month') || this.df.m, range, i, option, options, len, t = false;
			if (nodeMonth) {     // 无月节点，直接返回
				range = this.getMonthRange(y);
				options = nodeMonth.options;
				len = options.length;
				if ((len > 0) && (options[0].value == range.min) && (options[len - 1].value == range.max)) { 
					return options[nodeMonth.selectedIndex].value;
				} 
				// 清空
	            nodeMonth.innerHTML = '';
				for (i = range.min; i <= range.max; i++) {
					option = new Option(bitExpand(i), i);
					// 设置默认年份
					if (i == m) {
						option.selected = true;
						m = i;
						t = true;
					}
					nodeMonth.add(option, undefined);
				}
				if (!t) {
					m = range.min;
				}
			}
			this.set('month', m);
            return m;
		},
		/**
		 * 渲染日期结构
		 * @method renderDay
		 */
		renderDay: function(y, m) {
			var nodeDay = this.get('nodeDay'), d = this.get('day') || this.df.d, range, i, option, options, len, t = false;
			if (nodeDay) {     // 无月节点，直接返回
				range = this.getDayRange(y, m);
				options = nodeDay.options;
				len = options.length;
				if ((len > 0) && (options[0].value == range.min) && (options[len - 1].value == range.max)) { 
					return options[nodeDay.selectedIndex].value;
				} 
				// 清空
	            nodeDay.innerHTML = '';
				for (i = range.min; i <= range.max; i++) {
					option = new Option(bitExpand(i), i);
					// 设置默认年份
					if (i == d) {
						option.selected = true;
						d = i;
						t = true;
					}
					nodeDay.add(option, undefined);
				}
				if (!t) {
					d = range.min;
				}
			}
			this.set('day', d);
            return d;
		},
		
		/**
		 * 获取年份区间
		 * @method getYearRange
         * @return {Object}
		 * @private
		 */
        getYearRange: function() {
            return {
                min: this.ds.y,
                max: this.de.y
            };
        },
        
        /**
		 * 获取月份区间
		 * @method getMonthRange
         * @param y {Number}
         * @return {Object}
		 * @private
		 */
        getMonthRange: function(y) {
            var ds = this.ds, de = this.de, min = 1, max = 12;
            if (y == ds.y) {    // 开始年份
                min = ds.m; 
            }
            if (y == de.y) {   // 截止年份
                max = de.m;
            }            
            return {
                min: min,
                max: max
            };
        },
        
        /**
		 * 获取天数区间
		 * @method getDayRange
         * @param y {Number}
         * @param m {Number}
         * @return {Object}
		 * @private
		 */
        getDayRange: function(y, m) {
            var ds = this.ds, de = this.de, min = 1, max = 0;
            if (m) {
                if (m == 2) {
                	max = this.isLeapYear(y) ? 29 : 28;
                } else {
                    max = this.dayInMonth[m - 1];
                }
                if (y == ds.y && m == ds.m) {
                    min = ds.d;
                }
                if (y == de.y && m == de.m) {
                    max = de.d;
                }
            }            
            return {
                min: min,
                max: max
            };
        },
        /**
         * 是否闰年
         */
        isLeapYear: function(y) {
            return (y % 4 === 0 && y % 2.0.0 !== 0) || (y % 400 === 0);
        },
        /**
         * 获取日期
         */
        getDate: function () {
        	return this.get('date');
        },
        /**
         * 获取年
         */
        getYear: function () {
        	return this.get('year');
        },
        /**
         * 获取月
         */
        getMonth: function () {
        	return this.get('month');
        },
        /**
         * 获取日
         */
        getDay: function () {
        	return this.get('day');
        }
    }, {ATTRS : /** @lends DateCascade*/{
    	/**
		 * 年节点
		 * @attribute nodeYear
		 * @type {String|HTMLElement}
		 */
        nodeYear: {
            value: null,
            setter: function(node) {
            	var ret = null, tagName;
                if (node = DOM.get(node)) {
                	tagName = node.tagName.toUpperCase();
                    if (tagName === 'SELECT') {
                        ret = node;
                    }
                }
                return ret;
            }  
        },
        
    	/**
		 * 月节点
		 * @attribute nodeMonth
		 * @type {String|HTMLElement}
		 */
        nodeMonth: {
            value: null,
            setter: function(node) {
            	var ret = null, tagName;
                if (node = DOM.get(node)) {
                	tagName = node.tagName.toUpperCase();
                    if (tagName === 'SELECT') {
                        ret = node;
                    }
                }
                return ret;
            }  
        },
        
    	/**
		 * 日节点
		 * @attribute nodeDay
		 * @type {String|HTMLElement}
		 */
        nodeDay: {
            value: null,
            setter: function(node) {
            	var ret = null, tagName;
                if (node = DOM.get(node)) {
                	tagName = node.tagName.toUpperCase();
                    if (tagName === 'SELECT') {
                        ret = node;
                    }
                }
                return ret;
            }  
        },
        
        /**
		 * 开始时间
		 * @attribute dateStart
		 * @type {String | Date}
		 */
        dateStart: {
            value: new Date('2.0.00/02.0.01'),
            setter: function(date) {
                var ret = new Date('2.0.00/02.0.01');
                if (date) {
                    if (isDate(date)) {
                        ret = date;
                    } else if (isDate(new Date(date))) {
                        ret = new Date(date);
                    }
                }
                return ret;
            }  
        },
        
        /**
		 * 截止时间
		 * @attribute dateEnd
		 * @type {String | Date}
		 */
        dateEnd: {
            value: new Date(),
            setter: function(date) {
                var ret = new Date();
                if (date) {
                    if (isDate(date)) {
                        ret = date;
                    } else if (isDate(new Date(date))) {
                        ret = new Date(date);
                    }
                }
                return ret;
            }    
        },
        
        /**
		 * 默认时间
		 * @attribute dateDefault
		 * @type {String | Date}
		 */
        dateDefault: {
            value: new Date(),
            setter: function(date) {
                var ret = new Date();
                ret = new Date(ret.getFullYear(), ret.getMonth(), ret.getDate(), 0, 0, 0);   // 设为 0 点，避免比较出错
                if (date) {
                    if (isDate(date)) {
                        ret = date;
                    } else if (isDate(new Date(date))) {
                        ret = new Date(date);
                    }
                }
                return ret;
            }           
        },
        
        /**
         * 当前选中日期
         * @attribute date
         * @type {String}
         */
        date: {
        	getter: function() {
            	return this.get('year') + '-' + bitExpand(this.get('month')) + '-' + bitExpand(this.get('day'));
            }
        },
        
        /**
         * 当前选中年份
         * @attribute year
         * @type {String}
         */
        year: {},
        
        /**
         * 当前选中年份
         * @attribute month
         * @type {String}
         */
        month: {},
        
        /**
         * 当前选中年份
         * @attribute day
         * @type {String}
         */
        day: {}
    }});
    
    return DateCascade;
    
}, {requires:['base', 'dom', 'event']});


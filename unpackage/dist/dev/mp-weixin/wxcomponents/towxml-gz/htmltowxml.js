
const towxml = require('./index')
Component({
    options:{
      styleIsolation:'shared'
    },
    properties:{
      value:{
        type:String,
        value:''
      }
    },
    data: {
		isLoading: true,					// 判断是否尚在加载中
		article: {}						// 内容数据
	},
	attached() {
		let result = towxml(this.data.value||`<div style="text-align:center;"><img src="https://web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png"/></div>`,'html',{
			base:'https://xxx.com',				// 相对资源的base路径
			theme:'light',					// 主题，默认`light`
			events:{					// 为元素绑定的事件方法
				tap:(e)=>{
                    console.log('tap',e);
                    this.triggerEvent('click', e)
				}
			}
		});

		// 更新解析数据
		this.setData({
			article:result,
			isLoading: false
		});
		
	}
  })
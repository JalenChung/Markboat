<template>
	<view class="page dark" :style="`font-size: ${fontSize}px;`" @click="dropdownOpenFn" @touchStart="dropdownOpenFn">
		<view class="header">
			<view class="nav-btns-box" @mouseover="dropdownSelect">
				<view class="markboat-logo"></view>
				<dropdown :navText='"文件(F)"' data-id="dropdown-F" :isOpen="dropdownOpen" :nodeName="'F'"
					:active="activeDropdown == 'F'" @touchend="dropdownTouchend">
					<dropdown-item>
						<view>新建</view>
					</dropdown-item>
					<dropdown-item>
						<view @click="popupShow = true">导入</view>
					</dropdown-item>
					<dropdown-item>
						<view>导出</view>
					</dropdown-item>
					<dropdown-item>
						<view>保存</view>
					</dropdown-item>
				</dropdown>
				<dropdown :navText='"文件(T)"' data-id="dropdown-T" :isOpen="dropdownOpen" :nodeName="'T'"
					:active="activeDropdown == 'T'" @touchend="dropdownTouchend">
					<dropdown-item>
						<view>新建</view>
					</dropdown-item>
					<dropdown-item>
						<view>导入</view>
					</dropdown-item>
					<dropdown-item>
						<view>导出</view>
					</dropdown-item>
					<dropdown-item>
						<view>保存</view>
					</dropdown-item>
				</dropdown>
			</view>
			<view class="nav-path-box">
				../../文件
			</view>
		</view>
		<view class="main">
			<view class="catalog-container" v-if="windowWidth < 1000 || catalogShow"
				:class="`${catalogShow ? 'show' : ''}`" :style="`width: ${catalogWidth}px;`">
				<catalog @headlineSelect="headlineSelect" :data="catalogData" :width="catalogWidth"></catalog>

				<view class="controller" @mousedown="dragStart"></view>
			</view>
			<view class="editor" :style="`width: ${windowWidth < 1000 ? '100%' : editorWidth + 'px'};`">
				<view class="content" :style="`width: ${windowWidth <= 480 ? '2' : '1'}00%;`"
					:class="{ 'show-preview': displayMode == '2' }">
					<view class="line-num-box" ref="lineNumBox">
						<!-- :style="`line-height: ${test}px;`" -->
						<view class="line-num"
							:style="`line-height: ${lineHeight * overflowArr[0]}px; height: ${lineHeight * overflowArr[0]}px;`"
							:class="{ 'active': activedLine == 1 }" v-if="!lineNum">1</view>
						<view class="line-num"
							:style="`line-height: ${lineHeight * overflowArr[i - 1]}px; height: ${lineHeight * overflowArr[i - 1]}px;`"
							:class="{ 'active': activedLine == i }" v-for="i in lineNum">{{ i }}
						</view>
					</view>

					<textarea :style="`line-height: ${lineHeight}px;`" class="content-md " maxlength="999999999999"
						@input="mdInput" v-model="mdContent" @tap="activeLine"
						@mouseover="contentMouseover_l"></textarea>

					<scroll-view class="content-html" v-if="platform == 'h5'" scroll-y="ture"
						:scroll-into-view="contentScrolltarget" :scroll-top="previewBoxScrollTop"
						@scroll="contentScroll" ref="previewBox">
						<div contenteditable="true" @mouseover="contentMouseover_r" v-html="htmlContent"
							id="htmlContentBox">
						</div>
					</scroll-view>

					<towxml class="content-wxml" v-if="platform != 'h5'" :nodes="wxmlContent"
						:scrollTarget="contentScrolltarget" />
				</view>
			</view>

		</view>
		<view class="placeholder"></view>
		<view class="footer">
			<view class="shortcut">
				<!-- 目录控制器 -->
				<view class="catalogController" @click="catalogController">
					<view v-if="catalogShow" class="list-img-open"></view>
					<view v-else="catalogShow" class="list-img-close"></view>
				</view>
				<!-- 分割线 -->
				<view class="split"></view>
				<!-- 快捷键：文字类 -->
				<view class="shortcut-bold"></view>
				<view class="shortcut-strikethrough"></view>
				<view class="shortcut-italic"></view>
				<view class="shortcut-font"></view>
				<view class="shortcut-quote"></view>
				<!-- 分割线 -->
				<view class="split"></view>
				<!-- 快捷键：添加一些其他的东西 -->
				<view class="shortcut-line"></view>

				<view @click="testFn">
					<view>test</view>
				</view>

				<view>_</view>
				<view>s</view>
				<view>&nbsp;</view>
				<view>M</view>
				<view>中</view>

				<view class="switcher" v-if="showSwitcher" @click="displayMode = displayMode == '1' ? '2' : '1'"
					:class="displayMode == '1' ? 'show-md' : 'show-html'">
					<view class="md-img"></view>
					<view class="html-img"></view>
				</view>
			</view>
		</view>
		<!-- 导入弹窗 -->
		<view class="import-popup" :class="popupShow ? 'popup-show' : ''">
			<view class="popup-header">
				<view style="font-size:medium;">导入</view>
				<view class="finger" style="font-size:larger;" @click="closePop">×</view>
			</view>
			<!-- H5 -->
			<view class="fileChange">
				<FileDropZone @drop="ondrop" @click="chooseFile" :mode="platform">
					<view style="font-size: 30px;">+</view>
					<view>点击选择文件 or 拖动文件到此处</view>
				</FileDropZone>
			</view>

			<view class="btn-box clearfix">
				<button @click="confirm">确定</button>
				<button @click="closePop">取消</button>
			</view>
		</view>
	</view>
	<!-- 字符宽度计算器 -->
	<view class="text_width_calc">
		<view :class="'text-' + index" v-for="(item, index) in mdContentArr">{{ item }}</view>
	</view>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import toc from 'markdown-it-toc-done-right'
import anchor from 'markdown-it-anchor'
import Turndown from 'turndown'
// 自定义组件
import Dropdown from '../../components/dropdown/index.vue'
import DropdownItem from '../../components/dropdown-item/index.vue'
import FileDropZone from '../../components/FileDropZone/index.vue'
import Catalog from '../../components/Catalog/index.vue'
import TestView from '../../components/TestView/index.vue'

import Token from '../../static/js/mdToken.js'
import throttle from '../../static/js/throttle.js'

import { ref, watch, computed, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

let windowWidth = ref(0)
let fontSize = ref(16)
let lineHeight = ref(21)
let overflowArr = ref([1])
let spaceWidth = 4.74

let towxml = null

// let test = ref(40)

// 运行平台
let platform = ref('')

// 目录宽度控制========================================
let catalogWidth = ref(200)
let catalogShow = ref(true)

let editorWidth = computed(() => {
	return windowWidth.value - catalogWidth.value
})
let cataActive = false, initialX, currentX = catalogWidth.value;
function dragStart(e) {
	initialX = catalogWidth.value - e.clientX;
	cataActive = true
}
function dragEnd(e) {
	// 停止拖动  
	initialX = null;
	cataActive = false;
}
function drag(e) {
	if (cataActive) {
		e.preventDefault();
		currentX = e.clientX - initialX; // currentX这个值是给底部的点击开关用的
		catalogWidth.value = currentX
		// 如果有md内容，则调整行号
		if (mdContent.value) {
			overflowCalc()
		}

	}
}
// 目录窗孔开关
function catalogController() {
	catalogShow.value = !catalogShow.value
	// 在桌面端，目录宽度由开关控制，而手机端不控制宽度，只控制位置
	if (windowWidth.value >= 1000) {
		catalogWidth.value = catalogShow.value ? currentX : 0
	}

	// 如果有md内容，则调整行号
	if (mdContent.value) {
		overflowCalc()
	}
}
// 给目录数据添加开关属性
function addSW(data) {
	data.showChild = true
	if (data.c.length > 0) {
		for (let i = 0; i < data.c.length; i++) {
			data.c[i] = addSW(data.c[i])
		}
	}
	return data
}

// 最大窗口的事件委托（目前委托方：导航）==================
// 点击激活navmenu的hover
let dropdownOpen = ref(false);
let activeDropdownName = '';
let dropdownOpenFn = e => {
	// h5平台下
	if (platform.value == 'h5') {
		if (e.target.dataset.nodeType == 'dropdown') {
			dropdownOpen.value = !dropdownOpen.value
		} else {
			dropdownOpen.value = false
		}
	}

	// 小程序
	if (platform.value != 'h5') {
		let id = e.target.dataset?.id?.split('-')
		if (id) {
			let type = id[0]
			let name = id[1]
			if (type == 'dropdown') {
				if (activeDropdownName == name) {
					dropdownOpen.value = !dropdownOpen.value
				} else {
					dropdownOpen.value = true
					activeDropdownName = name
				}

			} else {
				dropdownOpen.value = false
			}
		} else {
			dropdownOpen.value = false
		}

	}

	e.stopPropagation();
	// console.log(e);
	// console.log(dropdownOpen.value);

}
let activeDropdown = ref(null)
// 下拉框鼠标移动选择
let dropdownSelect = e => {
	let lastChange = e.target.dataset.nodename
	if (lastChange) {
		activeDropdown.value = lastChange
	}
}
// 下拉框的触摸选择
let dropdownTouchend = e => {
	activeDropdown.value = e.currentTarget.dataset.id.split('-')[1]
}

// 小屏：显示模式，1.html or 2.md
let displayMode = ref(1)


// 两个解析器
let mdParser = ref(null)
let htmlParser = ref(null)
// md字符串。内容
let mdContent = ref(null)
let mdContentArr = ref([])
let catalogContent = ref(null)
let catalogData = ref(null) // 目录的数据
let htmlInputBox = ref(null)
let htmlContent = ref(null)
let wxmlContent = ref(null)
let activedLine = ref(0) // 需要高亮的行号
let parseFile = ref({
	type: '',
	name: '',
	content: ''
})
let domIdArr = [] // 所有dom元素的id
let lineNum = computed(() => {
	let n = mdContent.value?.split('\n').length
	// activedLine.value = n
	return n
}) // md文本的行数
let mdIncrement = 0 // md的内容增量，正 or 负
function extractIds(htmlString) {
	const idPattern = /id=["']([^"']+)["']/g;
	let ids = [];
	let match;

	while ((match = idPattern.exec(htmlString)) !== null) {
		ids.push(match[1]);
	}

	return ids;
}
function findElementById(htmlString, targetId) {
	const regex = new RegExp(`<([a-z]+).*?id="${targetId}".*?>([^<]*)<\/\\1>`, 'i');
	const match = htmlString.match(regex);

	if (match) {
		// match[1] 是标签名，match[2] 是标签内的内容（如果有的话）  
		return {
			tagName: match[1],
			content: match[2]
		};
	}

	return null;
}
let modifyTargetId = null; // 【即将被修改的元素id】
let wxmlOptions = {
	// base: 'https://xxx.com',				// 相对资源的base路径
	theme: 'dark',					// 主题，默认`light`
	events: {					// 为元素绑定的事件方法
		tap: (e) => {
			modifyTargetId = e.currentTarget.id
		}
	}
}
function countSpacesRegex(str) {
	// 使用正则表达式匹配所有的空格字符  
	// 注意：这里我们使用[ ]来明确匹配空格字符，虽然\s也可以但会匹配其他空白字符  
	const matches = str.match(/\s/g) || []; // 如果没有匹配项，match()会返回null，所以我们用||[]来确保我们得到一个数组  
	return matches.length; // 返回匹配项的数量，即空格的数量  
}
async function textWidthCalc() {
	let promises = []
	for (let i = 0; i < mdContentArr.value.length; i++) {
		// 计算文本内容宽度
		promises.push(new Promise((res, rej) => {
			// 计算空格宽度
			// let spaceLen = countSpacesRegex(mdContentArr.value[i]) * spaceWidth
			let query = null
			if (platform.value == 'h5') {
				query = uni.createSelectorQuery().in(this);
			} else {
				query = uni.createSelectorQuery()
			}
			query.select('.text-' + i).boundingClientRect(data => {
				console.log(i);
				res(data ? data.width : 0)
				// return data.width
			}).exec();
		}))
	}
	return Promise.all(promises)
}
// 计算给定行的md溢出情况，并记录在溢出数组内
function overflowCalc() {
	textWidthCalc().then(res => {
		res.forEach((contentWidth, index) => {
			// let catalogW = windowWidth.value >= 1000 ? catalogWidth.value : 0
			// 输入框的宽度
			let mdinpWidth = 0;
			if (windowWidth.value >= 1000) {
				mdinpWidth = (windowWidth.value - currentX) / 2 - 10 - 40
			}
			if (windowWidth.value > 480 && windowWidth.value < 1000) {
				mdinpWidth = (windowWidth.value) / 2 - 10 - 40
			}
			if (windowWidth.value <= 480) {
				mdinpWidth = windowWidth.value - 10 - 40
			}
			// 超出了多少行
			let overflow_n = Math.ceil((contentWidth + mdIncrement * fontSize.value) / mdinpWidth)
			// 更新行的溢出记录
			overflowArr.value[index] = overflow_n > 0 ? overflow_n : 1

			// console.log("盒子宽度==>", mdinpWidth);
			// console.log('内容宽度==>', contentWidth);
		})
	})
}
function mdInput() {
	mdContentArr.value = mdContent.value.split('\n')
	// console.log(mdContentArr.value);

	let res = mdParser.value.render(mdContent.value)
	htmlContent.value = res
	domIdArr = extractIds(res)

	if ((platform.value != 'h5')) {
		wxmlContent.value = towxml(htmlContent.value, 'html', wxmlOptions);
	}

	overflowCalc()
}
// 当md内容发生改变，则调整行提示
watch(mdContent, (newVal, oldVal) => {
	if (!oldVal) {
		return
	}
	// let lastChart = null // 删除拿删除值，新增拿新增值
	if (newVal.length > oldVal.length) {
		// lastChart = newVal[newVal.length - 1]
		mdIncrement = 1
	}
	if (oldVal.length > newVal.length) {
		// lastChart = oldVal[oldVal.length - 1]
		mdIncrement = -1
	}
});
// 当观察到变化时执行的回调函数  
function htmlInput(mutationsList, observer) {
	let newHtmlContent = document.getElementById('htmlContentBox').innerHTML
	mdContent.value = htmlParser.value.turndown('' + newHtmlContent)
};

// 非输入事件 ==================================================
let lineNumBox = ref(null) // 行号盒子
let previewBox = ref(null) // 右边预览总体
let previewBoxScrollTop = ref()
let scrollTarget = 0 // 左1 右2
function contentMouseover_l() {
	scrollTarget = 1
}
function contentMouseover_r() {
	scrollTarget = 2
}
function contentScroll(e) {
	if (e.target.className == 'uni-textarea-textarea' && scrollTarget == 1) {
		let containerHeight = e.target.clientHeight
		// 右边的滚动比例
		let numerator = Math.ceil(e.target.scrollTop)
		let denominator = e.target.previousElementSibling.clientHeight - containerHeight
		let proportion = numerator / denominator
		// 左边
		let previewBoxHeight = document.querySelector('#htmlContentBox').clientHeight
		previewBoxScrollTop.value = previewBoxHeight * proportion
	} else if (scrollTarget == 2) {
		let containerHeight = document.querySelector('#htmlContentBox').parentNode.clientHeight
		// 右边 
		try {
			let numerator = e.detail.scrollTop
			let denominator = e.detail.scrollHeight
			let proportion = Math.ceil(numerator) / (denominator - containerHeight)
			// 右边
			let mdContentBox = document.querySelector('.uni-textarea-textarea')
			mdContentBox.scrollTop = mdContentBox.scrollHeight * proportion
		} catch (error) {

		}
	}

}
// 点击md内容，激活行高亮
function activeLine(e) {
	if (mdContent.value) {
		let lineNum = mdContent.value.split('\n').length

		let top_h = windowWidth <= 480 ? 40 : 30
		// lineNum_click: 鼠标点击的行
		let lineNum_click = Math.ceil((e.changedTouches[0].pageY - top_h) / lineHeight.value)
		// lineNum_corrected: 【高亮目标】纠正后得出，不考虑溢出情况下的真实应高亮的行
		let viewHeight = overflowArr.value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
		let lineNum_corrected = lineNum_click > viewHeight ? viewHeight : lineNum_click
		// 用正真高亮行去数组里找 -> 包括此行在内的前面左右行的溢出情况
		let overflow_n = 0 // 溢出量
		for (let i = 0; i < overflowArr.value.length; i++) {
			overflow_n += overflowArr.value[i];
			// 当溢出量大于【高亮目标】，则选中该行
			if (overflow_n >= lineNum_corrected) {
				activedLine.value = i + 1
				// console.log(i);
				break;
			}
		}
		console.log(lineNum_click, overflowArr.value);
	}
}
// 滑动目标
let contentScrolltarget = ref('');
// 点击导航触发滑动事件
function headlineSelect(e) {
	// console.log(e);
	contentScrolltarget.value = e

	const query = uni.createSelectorQuery(); // 不需要传入上下文
	// console.log(query);

	query.select(`#${e}`).boundingClientRect((data) => {
		// console.log(data);

		if (data) {
			const elementBTop = data.top; // 元素B在屏幕中的顶部位置
			// console.log('元素B的高度：', elementBTop);
			uni.showToast({
				title: `元素B的高度: ${elementBTop}px`,
				icon: 'none'
			});
		}
	}).exec();
}

// 导入=======================================================
let popupShow = ref(false)

// 按钮触发选择  
function chooseFile() {
	uni.chooseFile({
		success: (res) => {
			let file = res.tempFiles[0]
			readFile(file)
		}
	})
}
// 拖动触发选择
function ondrop(e) {
	const file = e.files[0];
	readFile(file)
}
// 识别文件类型 and 读取文件输出为字符串 to 
function readFile(file) {
	if (file) {
		console.log(file);
		parsedFile.value.name = file.name
		parsedFile.value.type = getFileExtension(file.name)

		const reader = new FileReader();
		reader.onload = function (e) {
			parsedFile.value.content = e.target.result;
		};
		// 读取文件内容  
		reader.readAsText(file);
	}
}
function getFileExtension(filename) {
	// 使用split('.')将字符串按'.'分割成数组  
	// 数组中的最后一个元素就是最后一个'.'后面的字符串  
	const parts = filename.split('.');
	// 如果数组长度大于1，说明存在'.'，则pop()出最后一个元素（即文件扩展名）  
	// 否则，返回空字符串或原始文件名（取决于你的需求）  
	return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

// 导入窗口开关
function closePop() {
	popupShow.value = false
}
function confirm() {
	// 判断解析类型并传递文件内容
	switch (parsedFile.value.type) {
		case 'md':
			mdContent.value = parsedFile.value.content
			// 确认导入md之后立即做一次解析
			htmlContent.value = mdParser.value.render(mdContent.value)
			break;
		case 'html':
			// 确认导入html之后，也立即做一次html to md解析
			// console.log("解析前：" + parsedFile.value.content);
			mdContent.value = htmlParser.value.turndown('' + parsedFile.value.content)
			// console.log("解析后：" + mdContent.value);
			htmlContent.value = mdParser.value.render(mdContent.value)
			break;

		default:
			mdContent.value = '暂不支持此类型文件！'
			break;
	}
	// 为了方便查看，第一次导入后关闭导航
	slashShow.value = 'display: block;'
	catalogShow.value = false
	closePop()
}

// 底部========================================================
let showSwitcher = ref(false)


function createDomId(tagName) {
	let id = ''
	// 从集体id数组中过滤出，该类型的数组

	let idArr = domIdArr.filter(e => e.includes(tagName))

	// 找到未被占用的id tag-n + 1
	for (let i = 0; i < idArr.length + 1; i++) {
		let n = i + 1
		id = tagName + '-' + n
		if (idArr.indexOf(id) == -1) {
			domIdArr.push(id)
			return id;
		}
	}
}

// 生命钩子 ====================================================
// onLoad(() => {
// 	let query = uni.createSelectorQuery().in(this);
// 	//需要给黄色区域设置一个id标识，在这里是demo
// 	query.select('#demo').boundingClientRect(data => {
// 		console.log(data.top)//这个就是距离顶部的高度
// 		this.listTop = data.top//赋值，待会要用
// 	}).exec();
// })

onBeforeMount(() => {
	// 获取平台信息 =====================================
	platform.value = process.env.UNI_PLATFORM
	if (platform.value != 'h5') {
		// 在微信端，导入wxml解析库代替v-html
		towxml = require("../../wxcomponents/towxml/index.js")
	}
	if (platform.value == 'h5') {
		// 在h5端，绑上目录的【拖拽事件】
		document.addEventListener('mouseup', dragEnd, false);
		document.addEventListener('mousemove', drag, false);
	}
	uni.getSystemInfo({
		success: (res) => {
			windowWidth.value = res.windowWidth// 可使用窗口宽度，单位px  
			// if (windowWidth.value <= 480) {
			// 	fontSize.value = 14
			// 	lineHeight.value = 19
			// }
			// if (windowWidth.value > 480 && windowWidth.value < 1000) {
			// 	fontSize.value = 16
			// 	lineHeight.value = 21
			// 	spaceWidth = 4.74
			// }
			// if (windowWidth.value >= 1000) {
			fontSize.value = 16
			lineHeight.value = 21
			spaceWidth = 4.74
			// }
		}
	});
	//窗体改变大小触发事件
	uni.onWindowResize((res) => {
		// windowWidth.value = res.size.windowWidth
	})
	// 仅在手机端才显示切换器 md / pre
	showSwitcher.value = windowWidth.value <= 480

	// 以下为【md解析器】的设置
	mdParser.value = new MarkdownIt({
		html: false,
		xhtmlOut: true,
		typographer: true
	}).use(anchor, {
		// permalink: true,
		// permalinkBefore: true,
		// permalinkSymbol: '§'
	}).use(toc, {
		listType: 'ul',
		callback: (html, ast) => {

			let newObj = addSW(ast)
			// console.log(newObj);
			

			// 未来所有的目录用这个作为数据
			catalogData.value = newObj

			catalogContent.value = html
			return html
		}
	})
	let oldId = null, id = null, parentName = '';
	// dui新加入的元素修改
	mdParser.value.core.ruler.push('add_attributes', function (state) {
		state.tokens.forEach(token => {
			if (token.tag.includes('h') && token.type == "heading_open") {
				let _id = 'h-' + token.attrGet('id')
				token.attrSet('id', _id)
				token.attrPush(['ref', _id]);
			}
			// 过滤出不为h的开头
			if (!token.attrs && token.nesting == 1 && token.tag && !token.tag.includes('h')) {
				// 给没有id的加id
				let oldIdIndex = domIdArr.indexOf(oldId)
				if (oldIdIndex > -1) {
					domIdArr.splice(oldIdIndex, 1);
				}
				id = createDomId(token.tag)
				token.attrPush(['id', id]);
				oldId = id
			}

			// 过滤出开头
			if (token.nesting == 1) {
				token.attrPush(['style', 'position: relative;'])
				parentName = token.tag
			}

			// 中间部分
			// if (token.nesting == 0 && token.children[0]?.content != undefined) {

			// 	let inputToken = new Token("heading_open", "input", 1)

			// 	token.children.push(inputToken)
			// }
		});

		console.log("================================");

	});
	// 以下为【html解析器】的设置
	htmlParser.value = new Turndown({ headingStyle: 'atx' })// 设置md解析风格
	htmlParser.value.addRule('cleanHeadAndScript', {
		filter: function (node, options) {
			return (
				node.nodeName === 'SCRIPT' || node.nodeName === 'TITLE' || node.nodeName === 'STYLE'
			)
		},
		replacement: function (content) {
			return ''
		}
	});


})

onMounted(() => {
	// 设备判断 - 初始化 - 绑定方法
	if (platform.value == 'h5') {
		// 选择目标节点  
		var targetNode = document.getElementById('htmlContentBox')
		// 配置观察选项:  
		var config = { characterData: true, subtree: true };
		// 创建一个观察器实例并传入回调函数  
		var observer = new MutationObserver(htmlInput);
		// 开始观察目标节点  
		observer.observe(targetNode, config);
		// 之后，你可以停止观察  
		// observer.disconnect();
		let mdinpBox = document.querySelector('.content-md')
		mdinpBox.addEventListener('wheel', contentScroll)
		mdinpBox.querySelector('.uni-textarea-textarea').addEventListener('scroll', contentScroll)
	}

})


function testFn(e) {
	// console.log("test");
	// console.log(catalogData.value);
	// console.log(catalogContent.value);


}




// export default {
// 	data() {
// 		return {
// 			title: 'Hello'
// 		}
// 	},
// 	onLoad() {

// 	},
// 	methods: {

// 	}
// }
</script>

<style>
@import url(../../static/style/index.css);
@import url(../../static/style/theme.css);
</style>
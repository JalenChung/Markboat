<template>
	<view class="container">
		<view class="page dark" :style="`font-size: ${fontSize}px;`" @click="dropdownOpenFn"
			@touchStart="dropdownOpenFn">
			<view class="header">
				<view class="nav-btns-box" @mouseover="dropdownSelect">
					<view class="markboat-logo"></view>
					<dropdown :navText="`文件${platform == 'h5' ? '(F)' : ''}`" data-id="dropdown-F"
						:isOpen="dropdownOpen" :nodeName="'F'" :active="activeDropdown == 'F'"
						@touchend="dropdownTouchend">
						<dropdown-item>
							<view>新建</view>
						</dropdown-item>
						<dropdown-item>
							<view @click="importFile">导入</view>
						</dropdown-item>
						<dropdown-item>
							<view @click="exportMD">导出</view>
						</dropdown-item>
						<dropdown-item>
							<view>保存</view>
						</dropdown-item>
					</dropdown>
					<dropdown :navText="`帮助${platform == 'h5' ? '(H)' : ''}`" data-id="dropdown-T"
						:isOpen="dropdownOpen" :nodeName="'T'" :active="activeDropdown == 'T'"
						@touchend="dropdownTouchend">
						<dropdown-item>
							<!-- https://markdown.com.cn/ -->
							<view @click="openGrammarHelp">Markdown语法帮助</view>
						</dropdown-item>
						<dropdown-item>
							<view>反馈/建议</view>
						</dropdown-item>
						<dropdown-item>
							<view>关于</view>
						</dropdown-item>
					</dropdown>
				</view>
				<view class="flieinfo">
					<view>{{ readRes.isSucceed ? parsedFile.name : 'newMarkdown.md' }}</view>
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
						<!-- md -->
						<scroll-view class="content-md" @scroll="mdContentScroll" :scroll-top="mdContentScrollTop"
							scroll-y="ture">
							<!-- 行号盒子  -->
							<view class="line-num-box">
								<!-- :style="`line-height: ${test}px;`" -->
								<view class="line-num"
									:style="`line-height: ${lineHeight * overflowArr[0]}px; height: ${lineHeight * overflowArr[0]}px;`"
									:class="{ 'active': activedLine == 1 }" v-if="!lineNum">1</view>
								<view class="line-num"
									:style="`line-height: ${lineHeight * overflowArr[i - 1]}px; height: ${lineHeight * overflowArr[i - 1]}px;`"
									:class="{ 'active': activedLine == i }" v-for="i in lineNum">{{ i }}
								</view>
							</view>
							<!-- md内容 -->
							<textarea v-if="isMdShow" :disabled="isMdDisabled" :show-confirm-bar="false" type="text"
								@focus="mdTextareaFocus" :focus="isMdfocused" :cursor="cursorPosition"
								:style="`line-height: ${lineHeight}px; height: ${mdinpHeight > windowHeight - hf_height * 2 ? mdinpHeight : windowHeight - hf_height * 2}px;`"
								class="md-inp-box" maxlength="999999999999" @input="mdInput" v-model="mdContent"
								@tap="activeLine" @touchend="mdTouchend" @longpress="mdLongpress"
								@mouseover="contentMouseover_l"></textarea>
						</scroll-view>

						<scroll-view class="content-html" @scroll="htmlContentScroll" v-if="platform == 'h5'"
							scroll-y="ture" :scroll-into-view="previewScrollTarget" :scroll-top="htmlContentScrollTop"
							ref="previewBox">
							<div contenteditable="true" @mouseover="contentMouseover_r" v-html="htmlContent"
								id="htmlContentBox">
							</div>
						</scroll-view>

						<towxml class="content-wxml" v-if="platform != 'h5'" :nodes="wxmlContent"
							:scrollTarget="previewScrollTarget" :scrollTop="wxmlContentScrollTop"
							@towxmlScroll="wxmlContentScroll" />
					</view>
				</view>

			</view>
			<view class="placeholder"></view>
			<view class="footer" :style="`bottom: ${footerBottom}px;`">
				<view class="shortcut">
					<!-- 目录控制器 -->
					<view class="catalogController finger" @click="catalogController">
						<view v-if="catalogShow" class="list-img-open"></view>
						<view v-else="catalogShow" class="list-img-close"></view>
					</view>
					<!-- 分割线 -->
					<view class="split"></view>
					<!-- 快捷键：改造类 -->
					<view @tap="shortcutFn" data-id="b" class="finger shortcut-bold">
						<view class="tip">Ctrl + b</view>
					</view>
					<view @tap="shortcutFn" data-id="d" class="finger shortcut-strikethrough">
						<view class="tip">Ctrl + d</view>
					</view>
					<view @tap="shortcutFn" data-id="i" class="finger shortcut-italic">
						<view class="tip">Ctrl + i</view>
					</view>
					<view @tap="shortcutFn" data-id="u" class="finger shortcut-underline">
						<view class="tip">Ctrl + u</view>
					</view>
					<view @tap="shortcutFn" data-id="m" class="finger shortcut-mark">
						<view class="tip">Ctrl + m</view>
					</view>
					<view @tap="shortcutFn" data-id="q" class="finger shortcut-quote">
						<view class="tip">Ctrl + q</view>
					</view>
					<view @tap="shortcutFn" data-id="I" class="finger shortcut-inline-code">
						<view class="tip">Ctrl + shift + i</view>
					</view>
					<!-- 分割线 -->
					<view class="split"></view>
					<!-- 快捷键：插入类 -->
					<view @tap="shortcutFn" data-id="l" class="shortcut-line">
						<view class="tip">Ctrl + l</view>
					</view>
					<view @tap="shortcutFn" data-id="C" class="shortcut-code">
						<view class="tip">Ctrl + shift + c</view>
					</view>
					<!-- 分割线 -->
					<!-- <view class="split"></view>
					<view @tap="undo" data-id="l" class="shortcut-redoundo">
						<view class="tip">Ctrl + z</view>
					</view>
					<view @tap="redo" data-id="l" class="shortcut-redoundo">
						<view class="tip">Ctrl + y</view>
					</view> -->
					<!-- <view @tap="testFn">
						<view>test</view>
					</view>
					<view>_</view>
					<view>s</view>
					<view>&nbsp;</view>
					<view>M</view>
					<view>中</view> -->

					<view class="switcher" v-if="showSwitcher" @click="switcherFn"
						:class="displayMode == '1' ? 'show-md' : 'show-html'">
						<view class="md-img"></view>
						<view class="html-img"></view>
					</view>
				</view>
			</view>
			<!-- 弹窗 -->
			<view class="popup" :class="popupShow ? 'popup-show' : ''">
				<view class="popup-header">
					<view :style="`font-size: ${platform == 'h5' ? 'medium' : 'large'};`">{{ popupTitle }}</view>
					<view class="finger" style="font-size:larger;" @click="closePop">×</view>
				</view>
				<!-- 导入 -->
				<view v-if="popupModel == 1">
					<view class="fileChange">
						<FileDropZone @drop="ondrop" @tap="chooseFile" :mode="platform">
							<view style="font-size: 30px;">+</view>
							<view>{{ platform == 'h5' ? '点击选择文件/' : '' }}拖动文件到此处</view>
						</FileDropZone>
					</view>
					<view class="selected-box" v-text="parsedFile.name"></view>
				</view>
				<!-- 导出 -->
				<view v-if="popupModel == 2">
					<view class="exportflie">
						<image :style="'width: 30px; height: 30px;'" :mode="'aspectFit'" :src="exportFileImg"></image>
						<input v-model="exportname" type="text" name="exportnameinp" id="exportnameinp">
						<view>.md</view>
					</view>
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
	</view>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import toc from 'markdown-it-toc-done-right'
import anchor from 'markdown-it-anchor'
import ins from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import prism from 'markdown-it-prism'
import Turndown from 'turndown'
// 代码高亮规则
import prismComponents from "prismjs/components.js"
import "prismjs/components/index.js"
// import "prismjs/components/prism-java"
// 自定义组件
import Dropdown from '../../components/dropdown/index.vue'
import DropdownItem from '../../components/dropdown-item/index.vue'
import FileDropZone from '../../components/FileDropZone/index.vue'
import Catalog from '../../components/Catalog/index.vue'
import TestView from '../../components/TestView/index.vue'

import Token from '../../static/js/mdToken.js'
import throttle from '../../static/js/throttle.js'
import debounce from '/static/js/debounce.js'

import { ref, watch, computed, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue';


const devLanguages = prismComponents.languages 
// Object.keys(devLanguages).forEach(e => {
// 	console.log(e);
// })

let windowWidth = ref(0)
let windowHeight = ref(0)
let fontSize = ref(16)
let lineHeight = ref(21)
let overflowArr = ref([1])
let spaceWidth = 4.74
let hf_height = ref(40) // 头部与脚步功能区的高度

let towxml = null

// 运行平台
let platform = ref('')

let popupModel = ref(0) // 弹窗显示模式 1.导入 2.导出
let popupTitle = ref('') // 弹出标题文字

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

// 小屏：显示模式，1.md or 2.pre
let displayMode = ref(1)


// 两个解析器
let mdParser = ref(null)
let htmlParser = ref(null)
// md字符串。内容
let mdContent = ref(null)
let mdContentArr = ref([])
let mdinpHeight = ref(0)
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
				// console.log(i);
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
		mdinpHeight.value = 0
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
			// 更新md输入框高度
			mdinpHeight.value = mdinpHeight.value + overflowArr.value[index] * lineHeight.value
			// console.log("盒子宽度==>", mdinpWidth);
			// console.log('内容宽度==>', contentWidth);
		})
	})
}
function mdInput() {
	mdContentArr.value = mdContent.value.split('\n')
	let res = htmlContent.value = mdParser.value.render(mdContent.value)
	domIdArr = extractIds(res)
	// overflowCalc()

	if ((platform.value != 'h5')) {
		wxmlContent.value = towxml(htmlContent.value, 'html', wxmlOptions);
	}
}
let _overflowCalc = debounce(overflowCalc, 100) // 防抖版的行号处理
// 当md内容发生改变，则调整行提示
watch(mdContent, (newVal, oldVal) => {
	_overflowCalc()
	if (!oldVal) {
		mdIncrement = 0
	} else {
		mdIncrement = newVal.length > oldVal.length ? 1 : -1
	}
});
// 当观察到变化时执行的回调函数  
function htmlInput(mutationsList, observer) {
	let newHtmlContent = document.getElementById('htmlContentBox').innerHTML
	mdContent.value = htmlParser.value.turndown('' + newHtmlContent)
};

// 非输入事件 ==================================================
let previewBox = ref(null) // 右边预览总体
let scrollTarget = 0 // 左1 右2
function contentMouseover_l() {
	scrollTarget = 1
}
function contentMouseover_r() {
	scrollTarget = 2
}
let mdContentScrollTop = ref(0)
let htmlContentScrollTop = ref(0)
let wxmlContentScrollTop = ref(0)
function mdContentScroll(e) {
	if (scrollTarget == 1 || platform.value != 'h5') {
		mdContentScrollTop.value = e.detail.scrollTop // 给行号盒子用的
		let editorHeight = windowHeight.value - lineHeight.value * 2
		// 右边的滚动比例 	
		let proportion = e.detail.scrollTop / (e.detail.scrollHeight - editorHeight)
		// 当在web平台时会触发左边的滚动
		if (platform.value == 'h5') {
			let htmlHeight = document.querySelector('#htmlContentBox').clientHeight
			htmlContentScrollTop.value = (htmlHeight - editorHeight) * proportion
		}
	}
}
function htmlContentScroll(e) {
	if (scrollTarget == 2) {
		let editorHeight = windowHeight.value - lineHeight.value * 2
		// 左边边的滚动比例
		let proportion = e.detail.scrollTop / (e.detail.scrollHeight - editorHeight)
		// console.log(proportion);
		mdContentScrollTop.value = (mdinpHeight.value - editorHeight) * proportion
	}
}
function wxmlContentScroll(e) {
	console.log('wxmlContentScroll=>', e);
	let editorHeight = windowHeight.value - lineHeight.value * 2
	// 左边边的滚动比例
	let proportion = e.detail.scrollTop / (e.detail.scrollHeight - editorHeight)
	// console.log(proportion);
	mdContentScrollTop.value = (mdinpHeight.value - editorHeight) * proportion
}
let footerBottom = ref(0)
// 点击md内容，激活行高亮
function activeLine(e) {
	if (mdContent.value) {
		let lineNum = mdContent.value.split('\n').length
		// lineNum_click: 鼠标点击的行
		let lineNum_click = Math.ceil((e.changedTouches[0].pageY - hf_height.value + mdContentScrollTop.value) / lineHeight.value)
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
	}
	isMdfocused.value = true
	if (platform.value != 'h5') {
		wx.onKeyboardHeightChange(res => {
			console.log(res.height)
			footerBottom.value = res.height
		})
	}
}
function mdTouchend() {
	if (platform.value != 'h5') {
		wx.getSelectedTextRange({
			complete: res => {
				console.log(res);
				textRange = res
			}
		})
	}
}
function mdLongpress() {
	if (platform.value != 'h5') {
		wx.getSelectedTextRange({
			complete: res => {
				console.log(res);
				textRange = res
			}
		})
	}
}
// 滑动目标（预览内容）
let previewScrollTarget = ref('');
// 点击导航触发滑动事件
function headlineSelect(e) {
	previewScrollTarget.value = e
	const query = uni.createSelectorQuery();
	query.select(`#${e}`).boundingClientRect((data) => {
		if (data) {
			const elementBTop = data.top - lineHeight.value; // 元素B在屏幕中的顶部位置
			mdContentScrollTop.value = elementBTop
		}
	}).exec();
}

// 帮助
function openGrammarHelp() {
	if (platform == 'h5') {
		window.open('https://markdown.com.cn/', '_blank');
	}
	if (platform != 'h5') {
		uni.navigateTo({
			url: '/pages/grammarPage/index'
		});
	}
}

// 导入 / 文件=======================================================
let popupShow = ref(false)
let newFile = null // 待解析的
let parsedFile = ref({
	name: '',
	type: '',
	content: null
})// 已解析的
let readRes = ref({
	isSucceed: false,
	msg: ''
})
function fileObjInit() {
	parsedFile.value = {
		name: '',
		type: '',
		content: null
	}
}
// 按钮触发选择  
function chooseFile() {
	fileObjInit()
	if (platform.value == 'h5') {
		uni.chooseFile({
			success: (res) => {
				let file = res.tempFiles[0]
				readFile(file)
			}
		})
	}
	if (platform.value != 'h5') {
		wx.chooseMessageFile({
			success: (res) => {
				console.log(res);
				let file = res.tempFiles[0]
				readFile(file)
			},
			fail: (err) => {
				console.error(err);
			}
		})
	}
}
// 拖动触发选择
function ondrop(e) {
	fileObjInit()
	const file = e.files[0];
	readFile(file)
}
// 识别文件类型 and 读取文件输出为字符串 to 
function readFile(file) {
	if (file) {
		parsedFile.value.name = file.name
		let type = parsedFile.value.type = getFileExtension(file.name)
		// h5端的文件读取
		if (platform.value == 'h5') {
			console.log(file);
			newFile = file
			if (type == 'md' || type == 'html') {
				const reader = new FileReader();
				reader.onload = function (e) {
					parsedFile.value.content = e.target.result;
				};
				// 读取文件内容  
				reader.readAsText(newFile);
			} else {
				readRes.value.isSucceed = false
				readRes.value.msg = '暂不支持该类型文件！'
			}
		}
		// 微信端的文件读取
		if (platform.value != 'h5') {
			if (type == 'md' || type == 'html') {
				wx.getFileSystemManager().readFile({
					filePath: file.path, // 文件的本地路径  
					encoding: 'utf8', // 编码格式  
					success: res => {
						// res.data 是文件的内容  
						console.log(res.data);
						parsedFile.value.content = res.data
					},
					fail: console.error
				});
			} else {
				readRes.value.isSucceed = false
				readRes.value.msg = '暂不支持该类型文件！'
			}
		}
	} else {
		readRes.value.isSucceed = false
		readRes.value.msg = '文件读取失败'
		return 0;
	}
}
// 通过文件名截获文件类型
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
	// 导入模式
	if (popupModel.value == 1) {
		if (parsedFile.value.content) {
			readRes.value.isSucceed = true
			readRes.value.msg = '文件读取成功'
			console.log(parsedFile.value);

			if (parsedFile.value.type == 'md') {
				mdContent.value = parsedFile.value.content
				// 确认导入md之后立即做一次解析
				htmlContent.value = mdParser.value.render(mdContent.value)
				if ((platform.value != 'h5')) {
					wxmlContent.value = towxml(htmlContent.value, 'html', wxmlOptions);
				}
			}
			if (parsedFile.value.type == 'html') {
				mdContent.value = htmlParser.value.turndown('' + parsedFile.value.content)
				// 确认导入md之后立即做一次解析
				htmlContent.value = mdParser.value.render(mdContent.value)
			}
		}
	}
	// 导出模式
	if (popupModel.value == 2) {
		console.log(exportname.value);
		downloadMarkdown(mdContent.value, exportname.value)
	}
	// 为了方便查看，第一次导入后关闭导航
	// catalogController()
	closePop()
}
function downloadMarkdown(text, fileName) {
	if (platform.value == 'h5') {
		const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = fileName + '.md';
		document.body.appendChild(a);
		a.click();

		// 清理  
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

}
function importFile() {
	popupShow.value = true
	popupModel.value = 1
	popupTitle.value = '导入'
}
// 导出
function exportMD() {
	popupShow.value = true
	popupModel.value = 2
	popupTitle.value = '导出'
}
let exportFileImg = ref('../../static/images/Markdown.png')
let exportname = ref('')
// 快捷键相关===================================================
let textRange = null
function webTextSelect() {
	// 当鼠标释放时，获取选中的文本  
	uni.getSelectedTextRange().then(res => {
		textRange = res
	})
}
let cursorPosition = ref(-1)
let _cursorPosition = -1
function shortcutFn(e, key) {
	if (e) {
		key = e.target.dataset.id
	}
	let processedContent = ''
	if (textRange.hasOwnProperty('start') && textRange.start != textRange.end) {
		// 改造类的快捷键，有start
		let start = textRange.start
		let end = textRange.end
		switch (key) {
			case 'b':
				processedContent = `**${mdContent.value.substring(start, end)}**`
				_cursorPosition = end + 2
				textReplace(processedContent, start, end)
				break;
			case 'd':
				processedContent = `~~${mdContent.value.substring(start, end)}~~`
				_cursorPosition = end + 2
				textReplace(processedContent, start, end)
				break;
			case 'i':
				processedContent = `*${mdContent.value.substring(start, end)}*`
				_cursorPosition = end + 1
				textReplace(processedContent, start, end)
				break;
			case 'u':
				// 下划线
				processedContent = `++${mdContent.value.substring(start, end)}++`
				_cursorPosition = end + 2
				textReplace(processedContent, start, end)
				break;
			case 'm':
				// 下划线
				processedContent = `==${mdContent.value.substring(start, end)}==`
				_cursorPosition = end + 2
				textReplace(processedContent, start, end)
				break;
			case 'q':
				// 引用
				processedContent = `> ${mdContent.value.substring(start, end)}`
				_cursorPosition = end + 1
				textReplace(processedContent, start, end)
				break;
			case 'I':
				// 引用
				event.preventDefault();
				processedContent = `${'`'}${mdContent.value.substring(start, end)}${'`'}`
				_cursorPosition = end + 1
				textReplace(processedContent, start, end)
				break;
			default:
				break;
		}
	} else {
		// 插入类的快捷键，没有start
		let end = textRange.end ? textRange.end : mdContent.value.length
		switch (key) {
			case 'l':
				// 引用
				mdInsert('\n\n---\n', end)
				_cursorPosition = end + 6
				break;
			case 'C':
				// 引用
				mdInsert(`\n\n${'```请输入语言类型'} \n\n${'```'}`, end)
				_cursorPosition = end + 5 + 7
				break;
			default:
				break;
		}
	}
}
function shortcutTrigger(event) {
	if (event.ctrlKey) {
		// event.preventDefault();
		shortcutFn(null, event.key)
	}
}
let isMdfocused = ref(false)
let isMdDisabled = ref(false)
let isMdShow = ref(true)
function textReplace(replacement, start, end) {
	let str = mdContent.value;
	// 从开始位置之前的所有内容  
	let before = str.slice(0, start);
	// 从结束位置之后的所有内容  
	let after = str.slice(end);
	// 关闭原先的内容让文本失焦
	isMdShow.value = false
	// 三部分连接起来形成新的字符串  
	mdContent.value = before + replacement + after;
	// 重新聚焦
	setTimeout(() => isMdShow.value = true)
	// 重新计算右边页面和行号
	mdInput()
	_overflowCalc()
}
function mdInsert(insertString, position) {
	let newVal = mdContent.value.slice(0, position) + insertString + mdContent.value.slice(position)
	// 关闭原先的内容让文本失焦
	isMdShow.value = false
	mdContent.value = newVal
	// 重新聚焦
	setTimeout(() => isMdShow.value = true)
	// 重新计算右边页面和行号
	mdInput()
	_overflowCalc()
}
function mdTextareaFocus() {
	cursorPosition.value = _cursorPosition;
}
let history = {
	datas: [],
	index: 0,
}
// ctrl + z
function undo() {

}
// ctrl + y
function redo() {

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
let overf_i = 0
let overf_n = 0
function switcherFn() {
	displayMode.value = displayMode.value == '1' ? '2' : '1'
	if (displayMode.value == '2') {
		let mdTop = mdContentScrollTop.value / lineHeight.value
		for (overf_i = 0; overf_i < overflowArr.value.length; overf_i++) {
			overf_n += overflowArr.value[overf_i]
			// 当溢出量大于【高亮目标】，则选中该行
			if (overf_n >= mdTop) {
				break;
			}
		}
		previewScrollTarget.value = domIdArr[overf_i]
	}
	if (displayMode.value == '1') {
		const query = uni.createSelectorQuery();
		query.select(`#wx-content-box`).boundingClientRect((data) => {
			console.log(data);
		}).exec();
	}
	overf_i = overf_n = 0
}

// 生命钩子 ====================================================
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
			hf_height.value = res.windowWidth > 480 ? 30 : 40
			windowHeight.value = res.windowHeight
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
			lineHeight.value = 20.8
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

	// 以下为【md历史记录】的初始化
	// history.datas = new Array(10)

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
			catalogData.value = newObj
			return html
		}
	}).use(prism).use(ins).use(mark)
	let oldId = null, id = null, parentName = '';
	// dui新加入的元素修改
	mdParser.value.core.ruler.push('add_attributes', function (state) {
		state.tokens.forEach(token => {
			// 为行内代码添加样式
			if (token.children) {
				if (token.nesting == 0 && token.children.length > 0) {
					let codes = token.children.filter(e => e.type == "code_inline")
					codes.map(e => {
						e.attrSet('style',
							`
						background-color: #55555580;
                		border-radius: 5px;
						padding: .2em .4em;
						`
						)
					})

				}
			}

			// 为“引用”添加样式
			if (token.type == "blockquote_open") {
				token.attrSet('style',
					`
					position: relative;
					padding: 0 16px;
					border-left: 4px solid gray;
    				margin-bottom: 16px;
					`
				)
			}
			// 为h添加id
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
	console.log(platform.value);

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
		// 文本选择
		document.querySelector('.content-md').addEventListener('mouseup', webTextSelect);
		// 文本替换（快捷键）
		document.addEventListener('keydown', shortcutTrigger);
	}
})
function testFn(e) {
	console.log(uni);
	// console.log(catalogData.value);
}
</script>

<style>
@import url(../../static/style/index.css);
@import url(../../static/style/theme.css);
@import url(/node_modules/prismjs/themes/prism-okaidia.min.css);
</style>
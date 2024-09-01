<template>
	<view class="page dark" @click="dropdownOpenFn" @touchStart="dropdownOpenFn">
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
			<view class="catalog" :style="catalogStyle" :class="{ 'show': catalogShow }">
				<view ref="catalog" v-html="catalogContent"></view>
				<view class="controller" @mousedown="dragStart"></view>
			</view>
			<view class="editor">
				<view class="content" :class="{ 'show-html': displayMode == '2' }">
					<textarea class="content-md" maxlength="999999999999" @input="mdInput"
						v-model="mdContent"></textarea>
					<view class="content-preview">
						<div v-if="platform == 'h5'" contenteditable="true" v-html="htmlContent" id="htmlContentBox">
						</div>
						<mp-html v-if="platform != 'h5'" :content="htmlContent" />
					</view>
				</view>
			</view>
		</view>
		<view class="placeholder"></view>
		<view class="footer">
			<!-- <view class="inp-box" v-if="platform != 'h5'">
				<input type="text" name="footerInp" id="footerInp" v-model="modifiedText" @input="footerInpFn">
				<button>✔</button>
			</view> -->
			<view class="shortcut">
				<view class="catalogController" @click="catalogController">
					<view class="list-img"></view>
					<view class="slash-img" :style="slashShow"></view>
				</view>
				<view @click="testFn">test</view>
				<view>
					<input type="text" name="" id="" value="134">
				</view>
				<view>1</view>
				<view class="switcher" v-if="showSwitcher" @click="displayMode = displayMode == '1' ? '2' : '1'"
					:class="displayMode == '1' ? 'show-md' : 'show-html'">
					<view class="md-img"></view>
					<view class="html-img"></view>
				</view>
			</view>
		</view>

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
</template>

<script setup>
// 第三方库、插件
import MarkdownIt from 'markdown-it'
import toc from 'markdown-it-toc-done-right'
import anchor from 'markdown-it-anchor'
import Turndown from 'turndown'
// import MpHtml from 'mp-html/dist/mp-weixin'
// 自己封装的组件
import Dropdown from '../../components/dropdown/index.vue'
import DropdownItem from '../../components/dropdown-item/index.vue'
import FileDropZone from '../../components/FileDropZone/index.vue'
// 自己封装的函数
import Token from '../../static/js/mdToken.js'
import throttle from '../../static/js/throttle.js'

import { ref, watch, computed, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue';

// 运行平台
let platform = ref('')

// 目录宽度控制========================================
let catalogWidth = 200
let catalogShow = ref(true)
let catalog = ref(null)
let slashShow = ref('display: none;')
let catalogStyle = ref({
	width: catalogWidth + 'px',
	display: 'block'
})
let cataActive = false, xOffset = 0, initialX;
function dragStart(e) {
	initialX = e.clientX - xOffset;
	cataActive = true
}
function dragEnd(e) {
	// 停止拖动  
	initialX = null;
	cataActive = false;
}
function drag(e) {
	if (cataActive) {
		// 计算鼠标在x轴上移动的距离  
		e.preventDefault();
		var currentX = e.clientX - initialX;
		// 更新x偏移量  
		xOffset = currentX;
		catalogStyle.value.width = catalogWidth + currentX + 'px';
	}
}
// 目录窗孔开关
function catalogController() {
	let windowWidth = uni.windowWidth
	catalogShow.value = !catalogShow.value
	if (windowWidth > 1000) {
		if (catalogShow.value) {
			catalogStyle.value.display = 'block'
		} else {
			catalogStyle.value.display = 'none'
		}
	}
	slashShow.value = catalogShow.value ? 'display: none;' : 'display: block;'

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
let catalogContent = ref(null)
let htmlInputBox = ref(null)
let htmlContent = ref(null)
let wxmlContent = ref(null)
let parseFile = ref({
	type: '',
	name: '',
	content: ''
})
let domIdArr = []
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

function mdInput() {
	let res = mdParser.value.render(mdContent.value)
	htmlContent.value = res
	domIdArr = extractIds(res)

	// if ((platform.value != 'h5')) {
	// }
}

// 当观察到变化时执行的回调函数  
function htmlInput(mutationsList, observer) {
	let newHtmlContent = document.getElementById('htmlContentBox').innerHTML
	mdContent.value = htmlParser.value.turndown('' + newHtmlContent)
};
function mphtmlFn(e) {
	console.log(e);

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

// 底部===========================================
let showSwitcher = ref(true)


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

// 生命钩子 ========================================

onBeforeMount(() => {
	platform.value = process.env.UNI_PLATFORM

	if (platform.value != 'h5') {
	}

	mdParser.value = new MarkdownIt({
		html: false,
		xhtmlOut: true,
		typographer: true
	})
		.use(anchor, {
			// permalink: true,
			// permalinkBefore: true,
			// permalinkSymbol: '§'
		})
		.use(toc, {
			listType: 'ul',
			callback: (html, ast) => {

				// 未来所有的目录用这个作为数据
				// console.log(ast);

				let htmlString = html
				catalogContent.value = htmlString
				return htmlString
			}
		})

	// 下一步：考虑怎么输出目录
	htmlParser.value = new Turndown({ headingStyle: 'atx' })
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

	let oldId = null
	let id = null
	let parentName = ''
	// dui新加入的元素修改
	mdParser.value.core.ruler.push('add_attributes', function (state) {
		state.tokens.forEach(token => {
			// 过滤出不为h的开头
			if (!token.attrs && !token.tag.includes('h') && token.nesting == 1 && token.tag) {
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

	uni.getSystemInfo({
		success: (res) => {
			uni.windowWidth = res.windowWidth// 可使用窗口宽度，单位px  
			uni.windowHeight = res.windowHeight // 可使用窗口高度，单位px  
		}
	});
	if (uni.windowWidth > 480) {
		document.addEventListener('mouseup', dragEnd, false);
		document.addEventListener('mousemove', drag, false);
		// showSwitcher.value = false
	} else {
		// showSwitcher.value = true
	}

})

onMounted(() => {

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
	}

})


function testFn(e) {
	// console.log("test");
	// console.log(e);
	console.log(catalog.value);

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
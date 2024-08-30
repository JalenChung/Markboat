<template>
    <view class="dropdown" data-nodeType="dropdown" :data-nodeName='nodeName' :class='isOpen && active ? "active" : ""'>
        <span>{{ navText }}</span>
        <view class="dropdown-menu">
            <slot></slot>
        </view>
    </view>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue';
let props = defineProps({
    title: String, // 标题是一个字符串  
    navText: { // 消息是一个对象，具有类型和默认值  
        type: String,
        default: 'xxx'
    },
    // 当isOpen和active都真，菜单才落下
    isOpen: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    nodeName:{
        type: String,
        required: true
    }
});
onMounted(() => {  
//   console.log(props.nodeName); // 输出props中的message  
});  
</script>

<style>
@import url(./style.css);
</style>
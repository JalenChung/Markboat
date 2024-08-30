<template>
    <view class="file-drop-zone" id="file-drop-zone">
        <slot></slot> <!-- 插槽允许使用者插入自定义内容 -->
    </view>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

let props = defineProps({
    title: String, // 标题是一个字符串  
    mode: {
        type: String,
    }
});

// 定义 emit 事件
const emit = defineEmits(['drop']);

function ondrop(event) {
    ondropprevent(event); // 防止默认行为
    console.log(event.dataTransfer.files);

    emit('drop', {
        //   detail: { files: event.dataTransfer.files },
        files: event.dataTransfer.files,
        currentTarget: { dataset: {} }
    });
}

function ondropprevent(event) {
    event.stopPropagation();
    event.preventDefault();
}

onMounted(() => {
    if (props.mode) {
        const elem = document.getElementById('file-drop-zone');
        elem.addEventListener('drop', ondrop, false);
        elem.addEventListener('dragleave', ondropprevent, false);
        elem.addEventListener('dragenter', ondropprevent, false);
        elem.addEventListener('dragover', ondropprevent, false);
    }
});

onBeforeUnmount(() => {
    if (props.mode) {
        const elem = document.getElementById('file-drop-zone');
        elem.removeEventListener('drop', ondrop);
        elem.removeEventListener('dragleave', ondropprevent);
        elem.removeEventListener('dragenter', ondropprevent);
        elem.removeEventListener('dragover', ondropprevent);
    }
});
</script>

<style>
#file-drop-zone {
    width: 100%;
    height: 120px;
    border: 2px #a0a0a0 dashed;
    color: #a0a0a0;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 0px;
}
</style>
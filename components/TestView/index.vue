<template>
    <scroll-view class="scroll-box" scroll-y="true" :scroll-into-view="scrollTarget">
        <!-- <view class="content-container"> -->
            <view id="h-23">23</view>
            <view class="test-view">11</view>
        <!-- </view> -->

    </scroll-view>
</template>

<script setup>
let props = defineProps({
    title: String, // 标题是一个字符串  
    scrollTarget: {
        type: String,
    }
});
</script>

<style>
.scroll-box {
    height: 100%;
}

.content-container{
    height: max-content;
}

.test-view {
    height: 2000px;
}
</style>
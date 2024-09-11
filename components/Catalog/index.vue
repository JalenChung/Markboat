<template>
    <view v-if="data" v-for="(item1, index1) in data.c" :data-id="`h${item1.l}-${item1.n}`">
        <view :class="`catalog-item-1`" :data-id="`${index1}`" @tap="packUp">
            <view class="arrow-btn"></view>
            <view class="node-ds"></view>
            <view @tap="tapFn" :data-id="getid(item1.n)" class="text">{{ item1.n }}</view>
        </view>

        <view v-if="item1.c.length > 0 && item1.showChild" v-for="(item2, index2) in item1.c" :data-id="`h${item2.l}-${item2.n}`">
            <view :class="`catalog-item-2`" :data-id="`${index1}-${index2}`" @tap="packUp">
                <view class="arrow-btn"></view>
                <view class="node-ss"></view>
                <view @tap="tapFn" :data-id="getid(item2.n)" class="text">{{ item2.n }}</view>
            </view>

            <view v-if="item2.c.length > 0 && item2.showChild" v-for="(item3, index3) in item2.c" :data-id="`h${item3.l}-${item3.n}`">
                <view :class="`catalog-item-3`" :data-id="`${index1}-${index2}-${index3}`" @tap="packUp">
                    <view class="arrow-btn"></view>
                    <view class="node-ds"></view>
                    <view @tap="tapFn" :data-id="getid(item3.n)" class="text">{{ item3.n }}</view>
                </view>

                <view v-if="item3.c.length > 0 && item3.showChild" v-for="(item4, index4) in item3.c" :data-id="`h${item4.l}-${item4.n}`">
                    <view :class="`catalog-item-4`" :data-id="`${index1}-${index2}-${index3}-${index4}`" @tap="packUp">
                        <view class="arrow-btn"></view>
                        <view class="node-ss"></view>
                        <view @tap="tapFn" :data-id="getid(item4.n)" class="text">{{ item4.n }}</view>
                    </view>

                    <view v-if="item4.c.length > 0 && item4.showChild" v-for="(item5, index5) in item4.c"
                        :data-id="`h${item5.l}-${item5.n}`">
                        <view :class="`catalog-item-5`" :data-id="`${index1}-${index2}-${index3}-${index4}-${index5}`"
                            @tap="packUp">
                            <view class="arrow-btn"></view>
                            <view class="node-ds"></view>
                            <view @tap="tapFn" :data-id="getid(item5.n)" class="text">{{ item5.n }}</view>
                        </view>

                        <view v-if="item5.c.length > 0" v-for="(item6, index6) in item5.c"
                            :data-id="`h${item6.l}-${item6.n}`">
                            <view :class="`catalog-item-6`"
                                :data-id="`${index1}-${index2}-${index3}-${index4}-${index5}-${index6}`" @tap="packUp">
                                <view class="arrow-btn"></view>
                                <view class="node-ss"></view>
                                <view @tap="tapFn" :data-id="getid(item6.n)" class="text">{{ item6.n }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue';
let props = defineProps({
    data: {
        type: Object,
    },
    width: {
        type: Number,
    }
});
const emit = defineEmits(['headlineSelect']);
function tapFn(e) {
    emit('headlineSelect', 'h-' + e.target.dataset.id)
}
let idArr = []
function getid(str) {
    let res;
    if (idArr.length > 0) {
        let n = idArr.filter(e => e == str).length
        idArr.push(str)
        res = n > 0 ? str + '-' + n : str
    } else {
        idArr.push(str)
        res = str
    }
    // console.log(res);
    return res
}
let idList = [] //当前点击标题对应的id 所分割成的数组
function packUp(e) {
    idList = e.currentTarget.dataset.id.split('-')
    let child = findSWAndCtrl(props.data.c, 0)
}
// 找到在data中对应的位置，并控制开关(子节点，点击的ids，id_i)
function findSWAndCtrl(childs, n) {
    if (n < idList.length - 1) {
        return findSWAndCtrl(childs[idList[n]].c, ++n)
    }
    childs[idList[n]].showChild = !childs[idList[n]].showChild
    return childs[idList[n]]
}
onMounted(() => {
    console.log(props.data);
})
onBeforeUpdate(() => {
    idArr = []
});  
</script>

<style>
@import url(./style.css);
</style>
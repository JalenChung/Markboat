<template>
    <view v-if="data" v-for="(item1, index1) in data" :data-id="`h${item1.l}-${item1.n}`">
        <view class="catalog-item" style="padding-left: 20px;">
            <view @tap="tapFn" :data-id="getid(item1.n)">● {{ item1.n }}</view>
        </view>
        <view v-if="item1.c.length > 0" v-for="(item2, index2) in item1.c" :data-id="`h${item2.l}-${item2.n}`">
            <view class="catalog-item" style="padding-left: 40px;">
                <view @tap="tapFn" :data-id="getid(item2.n)">○ {{ item2.n }}</view>
            </view>
            <view v-if="item2.c.length > 0" v-for="(item3, index3) in item2.c" :data-id="`h${item3.l}-${item3.n}`">
                <view class="catalog-item" style="padding-left: 60px;">
                    <view @tap="tapFn" :data-id="getid(item3.n)">● {{ item3.n }}</view>
                </view>
                <view v-if="item3.c.length > 0" v-for="(item4, index4) in item3.c" :data-id="`h${item4.l}-${item4.n}`">
                    <view class="catalog-item" style="padding-left: 80px;">
                        <view @tap="tapFn" :data-id="getid(item4.n)">○ {{ item4.n }}</view>
                    </view>
                    <view v-if="item4.c.length > 0" v-for="(item5, index5) in item4.c"
                        :data-id="`h${item5.l}-${item5.n}`">
                        <view class="catalog-item" style="padding-left: 100px;">
                            <view @tap="tapFn" :data-id="getid(item5.n)">● {{ item5.n }}</view>
                        </view>
                        <view v-if="item5.c.length > 0" v-for="(item6, index6) in item5.c"
                            :data-id="`h${item6.l}-${item6.n}`">
                            <view class="catalog-item" style="padding-left: 120px;">
                                <view @tap="tapFn" :data-id="getid(item6.n)">○ {{ item6.n }}</view>
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
        type: Array,
    },

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
onBeforeUpdate(() => {
    idArr = []
});  
</script>

<style></style>
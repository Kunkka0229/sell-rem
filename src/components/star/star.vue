<template>
    <div class="star" :class="starType">
        <span class="star-item" v-for="(itemClass, index) in itemClasses" :class="itemClass"></span>
    </div>
</template>

<script type="text/ecmascript-6">

    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';

    export default{
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        data() {
            return {}
        },
        computed: {
            starType() {
                return 'star-' + this.size;
            },
            itemClasses() {
                let result = [];
                // 四舍五入
                let score = Math.floor(this.score * 2) / 2;
                // 判断是否有小数
                let hasDecimal = score % 1 !== 0;
                // 取整
                let integer = Math.floor(score);
                // 添加整颗星星
                for (let i = 0; i < integer; i++) {
                    result.push(CLS_ON);
                }
                // 根据判断是否有小数 添加半颗星星
                if (hasDecimal) {
                    result.push(CLS_HALF)
                }
                // 根据长度补齐灰色星星
                while (result.length < LENGTH) {
                    result.push(CLS_OFF)
                }
                return result;
            }
        },
        methods: {}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .star {
        font-size: 0;
        .star-item {
            display: inline-block;
            background-repeat: no-repeat;
        }
        &.star-48 {
            .star-item {
                width: 40px;
                height: 40px;
                margin-right: 44px;
                background-size: 40px 40px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('star48_on');
                }
                &.half{
                    @include bg-image('star48_half');
                }
                &.off {
                    @include bg-image('star48_off');
                }
            }
        }
        &.star-36 {
            .star-item {
                width: 30px;
                height: 30px;
                margin-right: 32px;
                background-size: 30px 30px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('star36_on');
                }
                &.half {
                    @include bg-image('star36_half');
                }
                &.off {
                    @include bg-image('star36_off');
                }
            }
        }
        &.star-24 {
            .star-item {
                width: 20px;
                height: 20px;
                margin-right: 6px;
                background-size: 20px 20px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('star24_on');
                }
                &.half {
                    @include bg-image('star24_half');
                }
                &.off {
                    @include bg-image('star24_off');
                }
            }
        }
    }
</style>
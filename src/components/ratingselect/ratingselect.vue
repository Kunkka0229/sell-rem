<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">{{ desc.all }}<span
                    class="count">{{ ratings.length }}</span></span>
            <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">{{ desc.positive }}<span
                    class="count">{{ positive.length }}</span></span>
            <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">{{ desc.negative }}<span
                    class="count">{{ negative.length }}</span></span>
        </div>
        <div class="switch" @click="toggleContent" :class="{'on': onlyContent}">
            <i class="icon-check_circle"></i>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    const POSITIVE = 0; // 推荐
    const NEGATIVE = 1; // 吐槽
    const ALL = 2;      // 全部

    export default{
        props: {
            // 评价数据
            ratings: {
                type: Array,
                default() {
                    return []
                }
            },
            // 选择 全部、推荐、吐槽
            selectType: {
                type: Number,
                default: ALL
            },
            // 只显示有内容的评价
            onlyContent: {
                type: Boolean,
                default: true
            },
            // 三个按钮显示的文字
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        data() {
            return {
                selectType2: this.selectType,
                onlyContent2: this.onlyContent
            }
        },
        methods: {
            select(type, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectType2 = type;
                this.$emit('select', type);
            },
            toggleContent(event) {
                if (!event._constructed) {
                    return;
                }
                this.onlyContent2 = !this.onlyContent2;
                this.$emit('onlyContent2', this.onlyContent2);
            }
        },
        computed: {
            positive() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE
                });
            },
            negative() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .ratingselect {
        .rating-type {
            padding: 36px 0;
            margin: 0 36px;
            @include border-1px(rgba(7, 17, 27, .1));
            font-size: 0;
            .block {
                display: inline-block;
                padding: 16px 24px;
                margin-right: 16px;
                border-radius: 2px; /*no*/
                line-height: 32px;
                color: rgb(77, 85, 93);
                font-size: 24px; /*px*/
                &.active {
                    color: #fff;
                }
                &.positive {
                    background: rgba(0, 160, 220, .2);
                    &.active {
                        background: rgb(0, 160, 220);
                    }
                }
                &.negative {
                    background: rgba(77, 85, 93, .2);
                    &.active {
                        background: rgb(77, 85, 93);
                    }
                }
                .count {
                    font-size: 16x; /*px*/
                    margin-left: 4px;
                }
            }
        }
        .switch {
            padding: 24px 36px;
            line-height: 48px;
            border-bottom: 1px solid rgba(7, 17, 27, .1);
            color: rgb(147, 153, 159);
            font-size: 0;
            &.on {
                .icon-check_circle {
                    color: #00c850;
                }
            }
            .icon-check_circle {
                display: inline-block;
                vertical-align: top;
                margin-right: 8px;
                font-size: 48px; /*px*/
            }
            .text {
                display: inline-block;
                vertical-align: top;
                font-size: 24px; /*px*/
            }
        }
    }
</style>
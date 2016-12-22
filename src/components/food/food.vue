<template>
    <transition name="move">
        <div class="food" v-show="showFlag" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{ food.name }}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{ food.sellCount }}</span>
                        <span class="rating">好评率{{ food.rating }}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{ food.price }}</span><span v-if="food.oldPrice" class="old">￥{{ food.oldPrice }}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food" @drop="drop"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车
                        </div>
                    </transition>
                </div>
                <split></split>
                <div class="info" v-if="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{ food.info }}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                                  :ratings="food.ratings" @select="select" @onlyContent2="onlyContent2"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-if="food.ratings && food.ratings.length">
                            <li v-for="rating in food.ratings" class="rating-item border-1px"
                                v-show="needShow(rating.rateType, rating.text)">
                                <div class="user">
                                    <span class="name">{{ rating.username }}</span>
                                    <img :src="rating.avatar" class="avatar">
                                </div>
                                <div class="time">{{ rating.rateTime | formatDate }}</div>
                                <div class="text">
                                    <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                                    {{ rating.text }}
                                </div>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import split from 'components/split/split';
    import ratingselect from 'components/ratingselect/ratingselect';
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import { formatDate } from 'common/js/date';

    const POSITIVE = 0; // 推荐
    const NEGATIVE = 1; // 吐槽
    const ALL = 2;      // 全部

    export default{
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL, // 默认选择全部
                onlyContent: true, // 默认只显示有内容的评价
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            }
        },
        components: {
            split,
            ratingselect,
            cartcontrol
        },
        methods: {
            drop() {
                // 传给父组件 触发事件
                this.$emit('drop', event.target);
            },
            show() {
                this.showFlag = true;
                // 初始化BScroll
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        })
                    } else {
                        // 重新计算
                        this.scroll.refresh();
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            // 详情页添加商品，按钮从加入购物车改变成cartcontrol组件
            addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                // 传给父组件 触发事件
                this.$emit('drop', event.target);

                // 给food数据添加count属性 显示cartcontrol组件
                Vue.set(this.food, 'count', 1);
            },
            select(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            onlyContent2(onlyContent) {
                this.onlyContent = onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            // 点击显示相应条件的评论
            needShow(type, text) {
                if (this.onlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true
                } else {
                    return type === this.selectType;
                }
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .food {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 92px;
        z-index: 30;
        width: 100%;
        background: #fff;
        &.move-enter-active, &.move-leave-active {
            transition: all .2s linear;
        }
        &.move-enter, &.move-leave-active {
            transform: translate3d(100%, 0, 0);
        }
        .food-content {
            .image-header {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .back {
                    position: absolute;
                    top: 20px;
                    left: 0;
                    .icon-arrow_lift {
                        display: block;
                        padding: 10px;
                        font-size: 40px; /*px*/
                        color: #fff;
                    }
                }
            }
            .content {
                padding: 36px;
                position: relative;
                .title {
                    line-height: 28px;
                    margin-bottom: 16px;
                    font-size: 28px; /*px*/
                    font-weight: 700;
                    color: rgb(7, 17, 27);
                }
                .detail {
                    margin-bottom: 36px;
                    line-height: 20px;
                    height: 20px;
                    color: rgb(147, 153, 159);
                    font-size: 0;
                    .sell-count, .rating {
                        font-size: 20px; /*px*/
                    }
                    .sell-count {
                        margin-right: 24px;
                    }
                }
                .price {
                    font-weight: 700;
                    line-height: 48px;
                    .now {
                        margin-right: 16px;
                        font-size: 28px; /*px*/
                        color: rgb(240, 20, 20);
                    }
                    .old {
                        text-decoration: line-through;
                        font-size: 20px; /*px*/
                        color: rgb(147, 153, 159);
                    }
                }
                .cartcontrol-wrapper {
                    position: absolute;
                    right: 24px;
                    bottom: 24px;
                }
                .buy {
                    position: absolute;
                    right: 36px;
                    bottom: 36px;
                    z-index: 10;
                    height: 48px;
                    line-height: 48px;
                    padding: 0 24px;
                    border-radius: 24px;
                    font-size: 20px; /*px*/
                    color: #fff;
                    background: rgb(0, 160, 220);
                }
            }
            .info {
                padding: 36px;
                .title {
                    line-height: 28px;
                    margin-bottom: 12px;
                    font-size: 28px; /*px*/
                    color: rgb(7, 17, 27);
                }
                .text {
                    line-height: 48px;
                    padding: 0 16px;
                    font-size: 24px; /*px*/
                    color: rgb(77, 85, 93);
                }
            }
            .rating {
                padding-top: 36px;
                .title {
                    line-height: 28px;
                    margin-left: 36px;
                    font-size: 28px; /*px*/
                    color: rgb(7, 17, 27);
                }
                .rating-wrapper {
                    padding: 0 36px;
                    .rating-item {
                        position: relative;
                        padding: 32px 0;
                        @include border-1px(rgba(7, 17, 27, .1));
                        .user {
                            position: absolute;
                            right: 0;
                            top: 32px;
                            lien-height: 32px;
                            font-size: 0;
                            .name {
                                display: inline-block;
                                vertical-align: top;
                                margin-right: 12px;
                                font-size: 20px; /*px*/
                                color: rgb(147, 153, 159);
                            }
                            .avatar {
                                border-radius: 50%;
                                width: 24px;
                                height: 24px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                        .time {
                            margin-bottom: 12px;
                            line-height: 24px;
                            font-size: 20px; /*px*/
                            color: rgb(147, 153, 159);
                        }
                        .text {
                            line-height: 32px;
                            font-size: 24px; /*px*/
                            color: rgb(7, 17, 27);
                            .icon-thumb_up, .icon-thumb_down {
                                margin-right: 8px;
                                line-height: 48px;
                                font-size: 24px; /*px*/
                            }
                            .icon-thumb_up {
                                color: rgb(0, 160, 220);
                            }
                            .icon-thumb_down {
                                color: rgb(147, 153, 159);
                            }
                        }
                    }
                    .no-rating {
                        padding: 32px 0;
                        font-size: 24px; /*px*/
                        color: rgb(147, 153, 159);
                    }
                }
            }
        }
    }
</style>
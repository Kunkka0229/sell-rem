<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left" :class="{'highlight': totalCount > 0}">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <i class="icon-shopping_cart"></i>
                        </div>
                        <div class="num" v-if="totalCount">{{ totalCount }}</div>
                    </div>
                    <div class="price">￥{{ totalPrice }}</div>
                    <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass" @click.stop.prevent="pay">{{ payDesc }}</div>
                </div>
            </div>
            <div class="ball-container">
                <template v-for="ball in balls">
                    <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                        <div class="ball" v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </template>

                <!--<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">-->
                <!--<div v-for="(ball, index) in balls" class="ball" v-if="ball.show" key="index">-->
                <!--<div class="inner inner-hook"></div>-->
                <!--</div>-->
                <!--</transition-group>-->
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food border-1px" v-for="food in selectFoods">
                                <span class="name">{{ food.name }}</span>
                                <span class="price">￥{{ food.price * food.count }}</span>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" @drop="drop"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';
    export default{
        props: {
            selectFoods: {
                type: Array,
                default(){
                    return [];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        components: {
            cartcontrol
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [], // 下落的小球数组
                fold: true /*折叠关闭*/
            }
        },
        computed: {
            // 获取购物总价
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            // 计算总数
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            // 起送计算
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差${diff}起送`;
                } else {
                    return '去结算';
                }
            },
            // 达到起送价格后改变按钮颜色
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            // 显示购物车
            listShow() {
                // 数量为空时，折叠关闭购物车列表
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                // 开启关闭购物车列表 ture关闭 false显示
                let show = !this.fold;
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            // 重新计算better-scroll高度
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            // 从cartcontrol 组件获取点击的位置
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        // 保存el
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            // 自定义动画
            beforeEnter(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        // getBoundingClientRect 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 64;
                        let y = -(window.innerHeight - rect.top - 44);

                        // 显示小球
                        el.style.display = '';
                        // 添加外层 y方向的过度
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        // 添加内层 x方向的过度
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;
                    }
                }
            },
            // 动画完成
            enter(el) {
                /* 触发浏览器重绘 */
                let rf = el.offsetHeight;

                // 动画完成时候的样子
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';

                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                });
            },
            // 动画完成之后
            afterEnter(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            // 点击开启关闭购物车列表
            toggleList() {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            // 清空列表
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            // 点击遮罩层隐藏收起购物车列表
            hideList() {
                this.fold = true;
            },
            // 点击支付
            pay() {
                if(this.totalPrice < this.minPrice){
                    return;
                }
                window.alert(`支付${this.totalPrice}元`);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        height: 96px;
        .content {
            display: flex;
            background: #141d27;
            color: rgba(255, 255, 255, .4);
            .content-left {
                flex: 1;
                .logo-wrapper {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    top: -20px;
                    margin: 0 36px;
                    padding: 12px;
                    width: 116px;
                    height: 116px;
                    box-sizing: border-box;
                    border-radius: 50%;
                    background: #141d27;
                    .logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        text-align: center;
                        background: #2b343c;
                        .icon-shopping_cart {
                            font-size: 48px;
                            line-height: 88px;
                            color: rgba(255, 255, 255, .4);
                        }
                    }
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 48px;
                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        border-radius: 32px;
                        font-size: 18px; /*px*/
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                    }
                }
                .price {
                    vertical-align: top;
                    display: inline-block;
                    line-height: 48px;
                    margin-top: 24px;
                    padding-right: 24px;
                    border-right: 1px solid rgba(255, 255, 255, .1); /*no*/
                    font-size: 32px; /*px*/
                    font-weight: 700;
                }
                .desc {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 48px;
                    margin: 24px;
                }
                &.highlight {
                    .logo-wrapper {
                        .logo {
                            background: rgb(0, 160, 220);
                            .icon-shopping_cart {
                                color: #fff;
                            }
                        }
                    }
                    .price {
                        color: #fff;
                    }
                }
            }
            .content-right {
                flex: 0 0 210px;
                width: 210px;
                .pay {
                    height: 96px;
                    line-height: 96px;
                    text-align: center;
                    font-size: 24px; /*px*/
                    font-weight: 700;
                    &.not-enough {
                        background: #2b333b;
                    }
                    &.enough {
                        background: #00b43c;
                        color: #fff;
                    }
                }
            }
        }
        .ball-container {
            .ball {
                position: fixed;
                left: 64px;
                bottom: 44px;
                z-index: 200;
                .inner {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgb(0, 160, 220);
                }
                &.drop-enter-active {
                    transition: all .4s cubic-bezier(.49, -0.29, .75, .41);
                    .inner {
                        transition: all .4s linear;
                    }
                }
            }
        }
        .shopcart-list {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            transform: translate3d(0, -100%, 0);
            &.fold-enter-active, &.fold-leave-active {
                transition: all .5s;
            }
            &.fold-enter, &.fold-leave-active {
                transform: translate3d(0, 0, 0);
            }
            .list-header {
                height: 80px;
                line-height: 80px;
                padding: 0 36px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, .1);
                .title {
                    line-height: 80px;
                    float: left;
                    font-size: 28px; /*px*/
                    color: rgb(7, 17, 27);
                }
                .empty {
                    float: right;
                    font-size: 24px; /*px*/
                    color: rgb(0, 160, 220);
                }
            }
            .list-content {
                padding: 0 36px;
                max-height: 434px;
                background: #fff;
                overflow: hidden;
                .food {
                    position: relative;
                    padding: 24px 0;
                    @include border-1px(rgba(7, 17, 27, .1));
                    .name {
                        line-height: 48px;
                        font-size: 28px; /*px*/
                        color: rgb(7, 17, 27);
                    }
                    .price {
                        position: absolute;
                        right: 180px;
                        bottom: 24px;
                        line-height: 48px;
                        font-weight: 700;
                        font-size: 28px; /*px*/
                        color: rgb(240, 20, 20);
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        bottom: 12px;
                        right: 0;
                    }
                }
            }
        }
    }

    .list-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index:40;
        background: rgba(7, 17, 27, .6);
        backdrop-filter: blur(10px);
        &.fade-enter-active, .fade-leave-active {
            transition: all .5s;
        }
        .fade-enter, .fade-leave-active {
            opacity: 0
        }
    }
</style>
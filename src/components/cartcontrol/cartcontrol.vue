<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-if="food.count" @click.stop.prevent="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-if="food.count">{{ food.count }}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">

    import Vue from 'vue';

    export default{
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {}
        },
        methods: {
            // 添加数量
            addCart(event) {
                // 防止多次被点击
                if (!event._constructed) {
                    return;
                }
                if (!this.food.count) {
                    // 添加food不存在的字段时 需要调用vue.set方法添加，这样才可以通过vue观测到这个字段的变化
                    Vue.set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }

                // 传给父组件 触发事件
                this.$emit('drop', event.target);
            },
            // 减少数量
            decreaseCart() {
                // 防止多次被点击
                if (!event._constructed) {
                    return;
                }
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .cartcontrol {
        font-size: 0;
        .cart-decrease {
            display: inline-block;
            padding: 12px;
            .inner {
                display: inline-block;
                line-height: 48px;
                font-size: 48px; /*px*/
                color: rgb(0, 160, 220);
            }
            &.move-enter-active, &.move-leave-active {
                transition: all .5s;
                transform: translate3d(0, 0, 0);
                .inner {
                    transition: all .5s;
                    transform: rotate(0deg);
                }
            }
            &.move-enter, &.move-leave-active {
                opacity: 0;
                transform: translate3d(48px, 0, 0);
                .inner {
                    transform: rotate(180deg);
                }
            }
        }
        .cart-count {
            display: inline-block;
            vertical-align: top;
            width: 24px;
            padding-top: 12px;
            line-height: 48px;
            text-align: center;
            font-size: 20px; /*px*/
            color: rgb(147, 153, 159);
        }
        .cart-add {
            display: inline-block;
            padding: 12px;
            line-height: 48px;
            font-size: 48px; /*px*/
            color: rgb(0, 160, 220);
        }
    }
</style>
<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <transition name="move">
            <keep-alive>
                <router-view :seller="seller"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import header from 'components/header/header';
    const ERR_OK = 0;

    export default {
        data() {
            return {
                seller: {}
            }
        },
        components: {
            'v-header': header
        },
        created() {
            this.$http.get('api/seller').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.seller = response.data;
                }
            });
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "common/scss/mixins";

    .tab {
        display: flex;
        width: 100%;
        height: 80px;
        line-height: 80px;
        font-size: 28px; /*px*/
        @include border-1px(rgba(7, 17, 27, 0.1));
        .tab-item {
            flex: 1;
            text-align: center;
            & > a {
                display: block;
                color: rgb(77, 85, 93);
                &.active {
                    color: rgb(240, 20, 20)
                }
            }
        }
    }

    .container {
        &.move-enter-active {
            transition: all .5s;
        }
        &.move-enter, &.move-leave-active {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>

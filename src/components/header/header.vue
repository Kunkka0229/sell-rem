<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{ seller.name }}</span>
                </div>
                <div class="description">
                    {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
                </div>
                <div class="support" v-if="seller.supports">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{ seller.supports[0].description }}</span>
                </div>
            </div>
            <div class="support-content" v-if="seller.supports" @click="showDetail">
                <span class="count">{{ seller.supports.length }}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{ seller.name }}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <!--flex 布局-->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul class="supports" v-if="seller.supports">
                            <li class="support-item" v-for="(item, index) in seller.supports">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{ seller.supports[index].description }}</span>
                            </li>
                        </ul>
                        <!--flex 布局-->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{ seller.bulletin }}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from 'components/star/star'
    export default{
        data() {
            return {
                detailShow: false
            }
        },
        props: {
            seller: {
                type: Object
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        methods: {
            showDetail() {
                this.detailShow = true;
            },
            hideDetail() {
                this.detailShow = false;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        components: {
            star
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .header {
        position: relative;
        color: #fff;
        background: rgba(7, 17, 27, .5);
        overflow: hidden;
        .content-wrapper {
            position: relative;
            padding: 48px 24px 36px 48px;
            font-size: 0;
            .avatar {
                display: inline-block;
                width: 128px;
                height: 128px;
                vertical-align: top;
                img {
                    border-radius: 4px; /*no*/
                }
            }
            .content {
                display: inline-block;
                margin-left: 32px;
                .title {
                    margin: 4px 0 16px 0;
                    .brand {
                        width: 60px;
                        height: 36px;
                        display: inline-block;
                        @include bg-image('brand');
                        background-size: 60px 36px;
                        background-repeat: no-repeat;
                        vertical-align: top;
                    }
                    .name {
                        margin-left: 12px;
                        line-height: 36px;
                        font-size: 32px; /*px*/
                        font-weight: 700;
                    }
                }
                .description {
                    margin-bottom: 20px;
                    line-height: 24px;
                    font-size: 24px; /*px*/
                }
                .support {
                    .icon {
                        display: inline-block;
                        vertical-align: top;
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                        background-size: 24px 24px;
                        background-repeat: no-repeat;
                        &.decrease {
                            @include bg-image('decrease_1');
                        }
                        &.discount {
                            @include bg-image('discount_1');
                        }
                        &.guarantee {
                            @include bg-image('guarantee_1');
                        }
                        &.invoice {
                            @include bg-image('invoice_1');
                        }
                        &.special {
                            @include bg-image('special_1');
                        }
                    }
                    .text {
                        line-height: 24px;
                        font-size: 20px; /*px*/
                    }
                }
            }
            .support-content {
                position: absolute;
                right: 24px;
                bottom: 36px;
                padding: 0 16px;
                height: 48px;
                line-height: 48px;
                background: rgba(0, 0, 0, .2);
                border-radius: 24px;
                text-align: center;
                .count {
                    vertical-align: top;
                    font-size: 20px; /*px*/
                }
                .icon-keyboard_arrow_right {
                    margin-left: 4px;
                    line-height: 48px;
                    font-size: 20px; /*px*/
                }
            }
        }
        .bulletin-wrapper {
            position: relative;
            height: 48px;
            line-height: 48px;
            padding: 0 44px 0 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: rgba(7, 17, 27, .2);
            .bulletin-title {
                display: inline-block;
                vertical-align: top;
                width: 44px;
                height: 24px;
                margin-top: 16px;
                @include bg-image('bulletin');
                background-size: 44px 24px;
                background-repeat: no-repeat;
            }
            .bulletin-text {
                vertical-align: middle;
                margin: 0 8px;
                font-size: 20px; /*px*/
            }
            .icon-keyboard_arrow_right {
                position: absolute;
                right: 24px;
                top: 16px;
                font-size: 20px; /*px*/
            }
        }
        .background{
            position: absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index: -1;
            filter: blur(10px)
        }
        .detail {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            overflow: auto;
            background: rgba(7, 17, 27, .8);
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            &.fade-enter-active, &.fade-leave-active {
                transition: all .5s
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0
            }
            .detail-wrapper {
                width: 100%;
                min-height: 100%;
                .detail-main {
                    margin-top: 128px;
                    padding-bottom: 128px; /*sticky footer 必须有  高度为需要定位元素所占的高度*/
                    .name {
                        line-height: 32px;
                        text-align: center;
                        font-size: 32px; /*px*/
                        font-weight: 700;
                    }
                    .star-wrapper {
                        margin-top: 32px;
                        padding: 4px 0;
                        text-align: center;
                    }
                    .title {
                        display: flex;
                        width: 80%;
                        margin: 56px auto 48px;
                        .line {
                            flex: 1;
                            position: relative;
                            top: -12px;
                            border-bottom: 1px solid rgba(255, 255, 255, .2); /*no*/
                        }
                        .text {
                            padding: 0 24px;
                            font-weight: 700;
                            font-size: 28px; /*px*/
                        }
                    }
                    .supports {
                        width: 80%;
                        margin: 0 auto;
                        .support-item {
                            padding: 0 24px;
                            margin-bottom: 24px;
                            font-size: 0;
                            &:last-child {
                                margin-bottom: 0;
                            }
                            .icon {
                                display: inline-block;
                                width: 32px;
                                height: 32px;
                                vertical-align: top;
                                margin-right: 12px;
                                background-size: 32px 32px;
                                background-repeat: no-repeat;
                                &.decrease {
                                    @include bg-image('decrease_2');
                                }
                                &.discount {
                                    @include bg-image('discount_2');
                                }
                                &.guarantee {
                                    @include bg-image('guarantee_2');
                                }
                                &.invoice {
                                    @include bg-image('invoice_2');
                                }
                                &.special {
                                    @include bg-image('special_2');
                                }
                            }
                            .text {
                                font-size: 24px;
                                line-height: 32px;
                            }
                        }
                    }
                    .bulletin {
                        width: 80%;
                        margin: 0 auto;
                        .content {
                            padding: 0 24px;
                            line-height: 48px;
                            font-size: 24px; /*px*/
                        }
                    }
                }
            }
            .detail-close {
                position: relative;
                width: 64px;
                height: 64px;
                margin: -128px auto 0; /*sticky footer 必须有*/
                clear: both; /*sticky footer 必须有*/
                font-size: 64px; /*px*/
            }
        }
    }
</style>
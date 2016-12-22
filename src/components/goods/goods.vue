<template>
    <div class="container goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li class="menu-item" v-for="(item, index) in goods" :class="{'current': currentIndex === index}"
                    @click="selectMenu(index, $event)">
                    <span class="text border-1px">
                        <span v-if="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{ item.name }}</h1>
                    <ul>
                        <li v-for="(food, index) in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
                            <div class="icon">
                                <img :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{ food.name }}</h2>
                                <p class="desc">{{ food.description }}</p>
                                <div class="extra">
                                    <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{ food.price }}</span><span v-show="food.oldPrice" class="old">￥{{ food.oldPrice }}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" @drop="drop"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectedFood" ref="food" @drop="drop"></food>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from 'components/shopcart/shopcart';
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import food from 'components/food/food';

    const ERR_OK = 0;

    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [], // 食物列表每个分类的高度
                scrollY: 0, // 食物列表滚动实时的y坐标
                selectedFood: {} // 被选中的食物，跳转到详情页
            }
        },
        components: {
            shopcart,
            cartcontrol,
            food
        },
        created() {
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    })
                }
            });
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        methods: {
            // 初始化BScroll
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3 // 监测实时滚动的位置
                });
                // 获取食物滚动时y的位置
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            // 获取食物列表每个分类的高度
            _calculateHeight() {
                // 获取食物的li Dom节点列表
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            // 点击分类列表，食物列表滚动到相应位置
            selectMenu(index, event) {
                // better-scroll 可以监听到此事件，浏览器原生不能监听到  防止pc端出现两次点击
                if (!event._constructed) {
                    return;
                }
                // 获取食物的li Dom节点列表
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let el = foodList[index];
                // 调用better-scroll 方法滚动到响应位置
                this.foodsScroll.scrollToElement(el, 300);
            },
            // 子组件事件触发
            drop(target) {
                // 体验优化，异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target);
                });
            },
            selectFood(food, event) {
                if(!event._constructed){
                    return;
                }
                this.selectedFood = food;
                // 调用子组件中的方法
                this.$refs.food.show();
            }
        },
        computed: {
            // 根据食物列表每个分类的高度，获取标题列表对应滚动的索引下标
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            // 购物车选中的食物
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                       if(food.count){
                           foods.push(food);
                       }
                    });
                });
                return foods;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixins";

    .goods {
        display: flex;
        position: absolute;
        top: 340px;
        bottom: 92px;
        width: 100%;
        overflow: hidden;
        .menu-wrapper {
            width: 160px;
            flex: 0 0 160px;
            background: #f3f5f7;
            .menu-item {
                display: table;
                line-height: 28px;
                padding: 0 24px;
                width: 160px;
                height: 108px;
                &.current {
                    position: relative;
                    margin-top: -1px;
                    z-index: 10;
                    background: #fff;
                    font-weight: 700;
                    .text {
                        @include border-none();
                    }
                }
                .icon {
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 4px;
                    width: 24px;
                    height: 24px;
                    background-size: 24px 24px;
                    background-repeat: no-repeat;
                    &.decrease {
                        @include bg-image('decrease_3');
                    }
                    &.discount {
                        @include bg-image('discount_3');
                    }
                    &.guarantee {
                        @include bg-image('guarantee_3');
                    }
                    &.invoice {
                        @include bg-image('invoice_3');
                    }
                    &.special {
                        @include bg-image('special_3');
                    }
                }
                .text {
                    display: table-cell;
                    width: 112px;
                    vertical-align: middle;
                    font-size: 24px; /*px*/
                    @include border-1px(rgba(7, 17, 27, .1));
                }
            }
        }
        .foods-wrapper {
            flex: 1;
            .title {
                padding-left: 28px;
                height: 52px;
                line-height: 52px;
                font-size: 24px; /*px*/
                color: rgb(147, 153, 159);
                border-left: 2px solid #d9dde1; /*no*/
                background: #f3f5f7;
            }
            .food-item {
                display: flex;
                margin: 36px;
                padding-bottom: 36px;
                @include border-1px(rgba(7, 17, 27, .1));
                &:last-child {
                    @include border-none();
                    margin-bottom: 0;
                }
                .icon {
                    flex: 0 0 114px;
                    width: 114px;
                    height: 114px;
                    margin-right: 20px;
                    img {
                        border-radius: 4px; /*no*/
                    }
                }
                .content {
                    flex: 1;
                    .name {
                        margin: 4px 0 16px 0;
                        line-height: 28px;
                        font-size: 28px; /*px*/
                        color: rgb(7, 17, 27);
                    }
                    .desc, .extra {
                        font-size: 20px; /*px*/
                        color: rgb(147, 153, 159);
                    }
                    .desc {
                        line-height: 24px;
                        margin-bottom: 16px;
                    }
                    .extra {
                        line-height: 10px;
                        .count {
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
                        right: 0;
                        bottom: 24px;
                    }
                }
            }
        }
    }
</style>
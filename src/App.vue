<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#app {
  .size;
}
#contentLeftDivider {
  margin: 15px 0 10px !important;
}
.clearfix:after {
  content: "."; /**/ /*内容为“.”就是一个英文的句号而已。也可以不写。*/
  display: block; /**/ /*加入的这个元素转换为块级元素。*/
  clear: both; /**/ /*清除左右两边浮动。*/
  visibility: hidden; /**/ /*可见度设为隐藏。注意它和display:none;是有区别的。visibility:hidden;仍然占据空间，只是看不到而已；*/
  line-height: 0; /**/ /*行高为0；*/
  height: 0; /**/ /*高度为0；*/
  font-size: 0; /**/ /*字体大小为0；*/
}

.clearfix {
  *zoom: 1;
}
.fs12 {
  font-size: 12px;
}
.dividerTree {
  margin: 16px 0 8px !important;
}
.titleFs18 {
  font-size: 18px;
}
.cardRightContent {
  margin-top: 22px !important;
  margin-bottom: 15px !important;
}
.ivu-menu-horizontal {
  height: 48px !important;
  line-height: 48px !important;
}
.turnBackRow {
  .header {
    width: 100%;
    height: 32px;
    position: relative;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span:nth-child(1) {
      position: absolute;
      z-index: 999;
    }
    & > span:nth-child(2) {
      width: 100%;
      position: absolute;
      text-align: center;
    }
  }
}
.textOFEls {
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  -webkit-line-clamp: 1;
}
.frameButtonMargin {
  margin-right: 10px;
}
.frameDevingStyle{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  img{
    width:75%;
  }
}
</style>

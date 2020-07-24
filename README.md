# vue-cvaiedu-template

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Docker Setup

``` bash
# 下载镜像文件
docker pull nginx

# 制作镜像
docker build -t cn.com.createview.vue.cjy/v1 .

# 查看镜像是否存在
docker images

# 导出本地镜像
docker save -o vue.cjy.tar cn.com.createview.vue.cjy/v1

# 上传服务器后，导入镜像
docker load < vue.cjy.tar

# 根据制作镜像的 default.conf 文件，容器使用端口是 80，宿主机这里使用 8080
docker run -d --restart always -p 8080:80 cn.com.createview.vue.cjy/v1

# 查看容器运行状态
docker ps -a
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

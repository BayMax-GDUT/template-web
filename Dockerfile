# 导入nginx镜像
FROM nginx:stable-alpine

# 作者
MAINTAINER Bright Chan

# 把当前打包工程的 html 复制到镜像里
COPY dist/ /usr/share/nginx/html

# 删除默认 default.conf
RUN rm /etc/nginx/conf.d/default.conf

# 复制 default.conf 配置文件到 NGINX 目录下
COPY default.conf /etc/nginx/conf.d/

RUN /bin/sh -c 'echo init ok!!!'

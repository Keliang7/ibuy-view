# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18.16.0 as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝所有文件到工作目录
COPY . .

# 构建生产环境下的 Vue 项目
RUN npm run build:pro

# 暴露容器的端口号，如果有需要的话
EXPOSE 7078

# 启动 Vue 项目，这里假设使用的是 http-server 作为静态服务器
CMD ["npm", "run", "serve"]

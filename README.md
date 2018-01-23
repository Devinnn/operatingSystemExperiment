# 操作系统实验

> 使用vue、vue-router、webpack和ES6开发。

## 实验内容

### 进程调度

- 先来先服务

- 时间轮转法

- 最高优先数

### 作业调度

- 先来先服务

- 短作业优先

- 响应比高者优先

### 存储管理

- 首次适应法

- 循环首次适应法

- 最佳适应法

- 最差适应法

## 备注

1. 已实现路由懒加载，优化首屏加载。
2. 前两个实验写的比较随便，代码风格欠佳。
3. `vue-router`使用`history`模式，`express`用`connect-history-api-fallback`中间件做代理。

## 使用方法

注：使用前需要安装node.js并配置环境。

1. `npm install` --- 安装依赖
2. `npm run dev` --- 运行开发环境
3. `npm run build` --- 打包编译
4. `node prod.server.js` --- 自建服务器生产环境下运行

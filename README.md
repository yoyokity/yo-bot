  <img src="https://socialify.git.ci/yoyokity/yo-bot/image?description=1&font=Source%20Code%20Pro&name=1&pattern=Diagonal%20Stripes&theme=Light" alt="Logo" align="center"/>

------

## 简介

**yoBot 用于对接 [NapCatQQ](https://github.com/NapNeko/NapCatQQ) (aka 猫猫框架) 的消息转发，实现机器人聊天**



## 优势

- [x] **基于node**：性能优越，生态丰富，使用简单
- [x] **安装简单**：node安装后 + 程序一键启动
- [x] **超低占用**：占用资源极低，适合在服务器上运行
- [x] **扩展简捷**：插件丢入即可启用，简单便捷
- [x] **开发舒适**：整合了常用api以及快捷操作，开发简易
- [x] **环境隔离**：每个插件享有独立环境包，互不干扰



## 使用前

**安装node并启动NapCat**



1. 安装 [node](https://nodejs.org/zh-cn/download/package-manager) 环境

2. 安装 [NapCat](https://github.com/NapNeko/NapCatQQ/releases)

3. 启用 NapCat 的正向ws，端口请保持和yobot的端口设置一致，默认为3001

   ```json
   "ws": {
       "enable": true,
       "host": "",
       "port": 3001
     },
   ```

4. 运行 NapCat



## 使用

1. 使用git或者直接下载源码到本地

2. 设置config.json

   ```js
   //botName、master必须填，其他的可以选填，不填的可以删除或值设为null
   
   {
     "botName": string,          //必填，机器人名字
     "master": number,           //必填，主人QQ号
     "host": string,             //ws地址，默认为本机
     "port": number,             //ws端口，默认为3001
     "debug": boolean,           //是否启用调试模式，会输出每次消息和心跳，默认为false
     "prefix": string[],         //命令前缀，一个数组元素对应一个前缀，默认为['.']
     "group": number[],          //允许的群组，null表示拉黑全部，[]表示接受全部，默认为[]
     "groupBlacklist": number[], //群组黑名单，[]则无黑名单，先判断group再判断黑名单，默认为[]
     "userBlacklist": number[],  //用户黑名单，[]表示无黑名单，默认为[]
     "canPrivate": boolean,      //是否允许私聊，默认true
     "canTemporary": boolean     //是否允许临时会话，默认false
   }
   ```

   

3. 点击bat启动



## 插件

将插件文件夹拖入plugins文件夹即可。

目录结构必须如下：

```tex
plugins/
├── 插件1/
│   ├── *.js
│   └── package.json
├── 插件2/
│   ├── *.js
│   └── package.json
```

不需要的插件可以删除或者在package.json中设置`"enable": false`



## 警告

> [!CAUTION]\
> **请不要在 QQ 官方群聊和任何影响力较大的简中互联网平台（包括但不限于: 哔哩哔哩，微博，知乎，抖音等）发布和讨论*任何*与本项目存在相关性的信息**

任何使用本仓库代码的地方，都应当严格遵守[本仓库开源许可](./LICENSE)。


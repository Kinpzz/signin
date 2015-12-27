#sign in system

## 使用说明
###### STEP1:
所需环境已在项目内声明，进入signin目录运行

	npm install

安装所需要的模块，或者根据自己所需要模块的位置进行选择

###### STEP2:

搭建mongodb数据库，实现持久化

首先还要将mongodb写成可以在shell运行的程序，在osx系统下可以在shell的rc文件添加

	export MONGO_PATH=/usr/local/mongodb
	export PATH=$PATH:$MONGO_PATH/bin

就可以在命令行直接用，mongod命令来使用了，若未进行这一步，也可以直接使用其所在的路径在执行。此处默认安装完了全局的mongodb,进入signin或者选择数据存放地址

	$ mongod ./data

其中data为存放数据的目录,并保持这个shell持续运行

###### SETP3:

运行服务器

	$ DEBUG=signin* node start

可以通过localhost:3000/进行访问,未登陆的用户会默认跳转到登陆页面

这里提供了一个测试账号：testadmin，账号密码相同，供测试。在作业中应ta要求未提交数据库，所以该测试账号无效

###### page:
* /regesit  注册页面<br/>
* /signin 登陆页面<br />
* /detail 详情页面, 仅供登陆用户查看，未登陆默认跳转登陆页面<br />
* / 根页面，未登陆默认跳转登陆页面，已登陆跳转详情页面<br />
* /detail?username=xxx 当xxx与登陆用户名相同时返回自己详情页面，若不同返回自己的详情页面并且提示只能访问自己的数据

## 实现说明
* 在页面通过js完成对注册和登陆的合法性校验，通过ajax进行信息查重。
* 使用session完成登陆的持续
* 使用mongodb完成数据的持续化
* 使用jade作为html模板

## 更新
* **2015.12.27** 完成迁移，持久化建立
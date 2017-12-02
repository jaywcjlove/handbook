

关掉窗口或者断开连接，进程就会被杀掉，为什么关掉窗口/断开连接会使得正在运行的程序死掉。supervisord、screen、[pm2](https://github.com/Unitech/pm2) 这些工具都可以解决上面的情况

# screen

| C-a ?    | 显示所有键绑定信息 |
| ----- | ----- |
| C-a w    | 显示所有窗口列表 |
| C-a C-a  | 切换到之前显示的窗口 |
| C-a c    | 创建一个新的运行shell的窗口并切换到该窗口 |
| C-a n    | 切换到下一个窗口 |
| C-a p    | 切换到前一个窗口(与C-a n相对) |
| C-a 0..9 |  切换到窗口0..9 |
| C-a a  | 发送 C-a到当前窗口 |
| C-a d  | 暂时断开screen会话 |
| C-a k  | 杀掉当前窗口 |
| C-a [  | 进入拷贝/回滚模式 |

有时在恢复 screen 时会出现 There is no screen to be resumed matching ****，遇到这种情况咋办呢？输入命令

screen -d ****

-A 　将所有的视窗都调整为目前终端机的大小。
-d <作业名称> 　将指定的screen作业离线。
-h <行数> 　指定视窗的缓冲区行数。
-m 　即使目前已在作业中的screen作业，仍强制建立新的screen作业。
-r <作业名称> 　恢复离线的screen作业。
-R 　先试图恢复离线的作业。若找不到离线的作业，即建立新的screen作业。
-s 　指定建立新视窗时，所要执行的shell。
-S <作业名称> 　指定screen作业的名称。
-v 　显示版本信息。
-x 　恢复之前离线的screen作业。
-ls或--list 　显示目前所有的screen作业。
-wipe 　检查目前所有的screen作业，并删除已经无法使用的screen作业。


screen -S yourname -> 新建一个叫yourname的session
screen -ls（或者screen -list） -> 列出当前所有的session
screen -r yourname -> 回到yourname这个session
screen -d yourname -> 远程detach某个session
screen -d -r yourname -> 结束当前session并回到yourname这个session


# 参考资料

- http://www.gnu.org/software/screen/
- http://www.ibm.com/developerworks/cn/linux/l-cn-screen/
- [Screen的man page提供了最详细的信息](http://www.slac.stanford.edu/comp/unix/package/epics/extensions/iocConsole/screen.1.html)

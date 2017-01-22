

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

# 参考资料

- http://www.gnu.org/software/screen/
- http://www.ibm.com/developerworks/cn/linux/l-cn-screen/
- [Screen的man page提供了最详细的信息](http://www.slac.stanford.edu/comp/unix/package/epics/extensions/iocConsole/screen.1.html)

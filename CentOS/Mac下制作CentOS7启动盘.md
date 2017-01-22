Mac上制作linux系统U盘安装盘
===

Mac下将ISO写入U盘可使用命令行工具dd，操作如下：

1. 找出U盘挂载的路径，使用如下命令：diskutil list
2. 将U盘unmount（将N替换为挂载路径）：diskutil unmountDisk /dev/disk[N]
3. 写入U盘：sudo dd if=iso路径 of=/dev/rdisk[N] bs=1m  rdisk 中加入r可以让写入速度加快


## 查看所有的disk

```bash
$ diskutil list
```

```bash
/dev/disk5 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *15.7 GB    disk5
   1:                  Apple_HFS TAIDIAN                 15.7 GB    disk5s1
```

## 解除其挂载

```bash
$ diskutil unmountDisk /dev/disk5
# 提示卸载成功！
# Unmount of all volumes on disk5 was successful
```

## 用 dd 命令将 iso 写入

这 /Volumes/Untitled\ 1/CentOS-7-x86_64-Everything-1511.iso 是我本地移动硬盘镜像路径

```bash
$ sudo dd if=/Volumes/Untitled\ 1/CentOS-7-x86_64-Everything-1511.iso of=/dev/disk5 bs=1m
```

使用brew安装pv工具，之后使用以下的命令来实现进度条的显示

```bash
sudo pv -cN source < /Users/kacperwang/Downloads/CentOS-7-x86_64-Everything-1511.iso | sudo dd of=/dev/disk2 bs=4m
## 显示下面进度
source:  5.2GiB 5:11:41 [ 503KiB/s] [=====================>       ] 71% ETA 2:01:56
```

## 查看磁盘进度

可以用iostat命令查看磁盘写入状态，进度。

```bash
$ iostat -w 5
              disk0               disk2               disk3       cpu    load average
    KB/t  tps  MB/s     KB/t  tps  MB/s     KB/t  tps  MB/s  us sy id   1m   5m   15m
   20.65   21  0.42   131.00    0  0.00   278.80    0  0.00   4  3 93  2.31 2.05 2.02
   14.29    1  0.02     0.00    0  0.00     0.00    0  0.00   2  3 95  2.45 2.08 2.03
   92.56   13  1.16     0.00    0  0.00     0.00    0  0.00   3  4 94  2.33 2.06 2.02
```

## pv时刻监控克隆的进度

用brew安装pv命令，之后才用如下方式执行dd命令：​

```bash
# 安装pv
brew install pv

# 刻监控克隆的进度
pv -cN source < xxx.img | dd of=/dev/rdisk2 bs=4m​
```

## 操作完毕后将U盘弹出

```bash
diskutil eject /dev/disk2
Disk /dev/disk2 ejected
```
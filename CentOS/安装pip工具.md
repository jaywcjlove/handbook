Centos7安装pip工具
===

## 下载

```bash
wget --no-check-certificate https://github.com/pypa/pip/archive/1.5.5.tar.gz
# wget获取https的时候要加上：--no-check-certificate
```


## 安装解压

```bash
tar -zvxf 1.5.5.tar.gz    #解压文件
cd pip-1.5.5/
python setup.py install
```

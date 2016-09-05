
1、卸载Android Studio，在终端(terminal)执行以下命令：

```bash 
rm -rf /Applications/Android\ Studio.app
rm -rf ~/Library/Preferences/AndroidStudio*
rm -rf ~/Library/Application\ Support/AndroidStudio*
rm -rf ~/Library/Logs/AndroidStudio*
rm -rf ~/Library/Logs/AndroidStudio
rm -rf ~/Library/Caches/AndroidStudio*
```

2、删除Projects

```bash 
rm -rf ~/AndroidStudioProjects
```

3、删除gradle

```bash 
rm -rf ~/.gradle
```

4、卸载Android Virtual Devices(AVDs) and *.keystore.

```bash
rm -rf ~/.android
```

5、删除Android SDK Tools

```bash 
rm -rf ~/Library/Android*
```

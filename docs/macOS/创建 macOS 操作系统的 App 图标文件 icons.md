创建 macOS 操作系统的 App 图标文件 icons
===

`.icns` 是 Apple 的 macOS 操作系统的 App 图标文件的扩展名。你可以通过鼠标`右键`点击 App - `显示包内容` - 进入 `Contents` 目录 - 进入 `Resources`目录，然后在目录下可以找到名为 `Appicon.icns` 或其他后缀为 `.icns` 的一个图标文件。

## 准备原始 `png` 图片

准备最大尺寸 `1024x1024` 图片一张，重命名为 `icon.png`，其他大小尺寸可以通过终端命令生成；

## 创建 `.iconset` 的文件夹

创建一个名为 `icons.iconset` 的文件夹：

```bash
mkdir icons.iconset
```

## 生成各种尺寸的 png 图片

通过 `终端` 来快速创建各种不同尺寸要求的图片文件。

```bash
sips -z 16 16 icon.png -o icons.iconset/icon_16x16.png
sips -z 32 32 icon.png -o icons.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png -o icons.iconset/icon_32x32.png
sips -z 64 64 icon.png -o icons.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png -o icons.iconset/icon_128x128.png
sips -z 256 256 icon.png -o icons.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png -o icons.iconset/icon_256x256.png
sips -z 512 512 icon.png -o icons.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png -o icons.iconset/icon_512x512.png
sips -z 1024 1024 icon.png -o icons.iconset/icon_512x512@2x.png
```

## 生成 `icns` 文件

`终端` 来中运行下面的命令，就可以获得名为 `icon.icns` 的图标文件了


```bash
iconutil -c icns icons.iconset -o icon.icns
```
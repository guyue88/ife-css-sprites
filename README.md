# IFE Css Sprites
自动生成css 雪碧图工具。

# 在线体验
[IFE Css Sprites](http://tool.luodao.me/css-sprite)

# 算法
主要参考  http://www.aaai.org/Papers/ICAPS/2003/ICAPS03-029.pdf 算法

### 基本思路
1. 排列矩形集合（S），按照高度从高到低进行排序
2. 取最高的1个矩形（s1）的宽高作为容器（Box）的初始宽高（BoxW，BoxH）
2. s1永远处于Box的左上角。BoxH 不变，BoxW 可以无线延伸
3. 判断第2个矩形（s2）能不能放到 Box 按照从左到右，从高到底这个顺序的空隙里面
	- 如果可以：放入 并 判断 BoxW 是否需要延伸
	- 如果不可以：放到s1的右边，BoxW 延伸
4. 继续第3步，判断s3, s4, s5......

#### 扩展思路
1. 根据Box的初始高度，可以得到最终最小面积（Best）的第一个样本（Sample）
2. 通过阶梯增加Box的高度（boxHeightStep），得到多个样本
3. 比较每个样本的 面积利用率（U），取最高的那个
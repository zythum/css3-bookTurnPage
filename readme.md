无需类库支持的css3类似书本翻页效果
---
导入

`<link rel="stylesheet" type="text/css" href="../sourse/book.css" media="all">`
`<script type="text/javascript" src="../sourse/book.js"></script>`

配置

```javascript
<script type="text/javascript">
	var aBook = book('book',{
		 width:576
		,height: 360
		,bookmark: 2
	})
	// 初始化
	//第一个参数为id字符串或者node结构
	//第二个值是参数。
	//  width ,height初始化大小 也可以不写自己用样式在定也可以
	//  bookmark 初始化定位在第几页
	//  
	// 方法
	// aBook.prev()    上一页
	// aBook.next()    下一页
	// aBook.turnTo(n) 翻到第n页
</script>
```

demo： [http://zythum.free.bg/book/demo/demo.html](http://zythum.free.bg/book/demo/demo.html)
![demo1](http://ww4.sinaimg.cn/large/a74e55b4jw1dy2nqgo5ahj.jpg)

function book(node,opt){
	var  pages     = []
		,bookmark  = 0
		,inited    = false
		,aniNode   = {prev:{}, next:{}}
		,animating = false
		,transName = (function(){
			var  arr = [
					'transition'
					,'WebkitTransition'
					,'MozTransition'
					// ,'OTransition'
					// ,'msTransition'
					// 暂时只支持firefox safari chrome 等一些
				]
				,len = arr.length				
				,i   = 0
			
			while(len - i){
				if(document.body.style[arr[i]] != undefined){
					return arr[i]
				}
				i += 1
			}
			return false
		})()
		,transNameCss = {
			 'WebkitTransition'	: '-webkit-'
			,'MozTransition'	: '-moz-'
			,'OTransition'		: '-o-'
			,'msTransition'		: '-ms-'
			,'transition'		: ''
		}[transName]
		,transEndEventName = {
			 'WebkitTransition'	: 'webkitTransitionEnd'
			,'MozTransition'	: 'transitionend'
			,'OTransition'		: 'oTransitionEnd'
			,'msTransition'		: 'MSTransitionEnd'
			,'transition'		: 'transitionend'
		}[transName]
		//样式
		,css = {
			pageClassName: 'book-page'
			,'ani-prev': {
				//翻页不动的那页
				 'staticPage': 'book-prev-staticPage'
				,'staticPage-inner': 'book-prev-staticPage-inner'

				//翻页时上面的那页
				,'frontPage': 'book-prev-frontPage'
				,'frontPage-inner': 'book-prev-frontPage-inner'
				
				//翻页时下面的那页
				,'backPage': 'book-prev-backPage'
				,'backPage-inner': 'book-prev-backPage-inner'
			}
			,'ani-next': {
				//翻页不动的那页
				 'staticPage': 'book-next-staticPage'
				,'staticPage-inner': 'book-next-staticPage-inner'

				//翻页时上面的那页
				,'frontPage': 'book-next-frontPage'
				,'frontPage-inner': 'book-next-frontPage-inner'
				
				//翻页时下面的那页
				,'backPage': 'book-next-backPage'
				,'backPage-inner': 'book-next-backPage-inner'
			}
		}

		//兼容或者缩写原生函数
		,core = {
			byId: function(id){
				return document.getElementById(id)
			}
			,cNode: function(type){
				return document.createElement(type)
			}
		}

		,funcs = {
			build: function(){
				var  children = node.children
					,len      = children.length
					,i        = 0
					,aniDomBuildFn
				
				while(len - i){
					pages.push(children[i])
					children[i].style.display = bookmark==i ? '' : 'none'
					node.insertBefore(children[i++], node.children[0])
				}

				if(!inited){
					opt.width  && (node.style.width  = opt.width+'px')
					opt.height && (node.style.height = opt.height+'px')

					aniDomBuildFn = function(storeObj,type){
						var s    = storeObj[type]
							,arr = ['staticPage', 'frontPage', 'backPage']
							,len = arr.length
							,i   = 0
							,shadow
						s.parent = core.cNode('div')
						s.parent.className = css.pageClassName
						while(len-i){
							s[arr[i]] = core.cNode('div')							
							s[arr[i]].className = css['ani-'+type][arr[i]]
							
							s[arr[i]+'-inner'] = core.cNode('div')
							s[arr[i]+'-inner'].className = css['ani-'+type][arr[i]+'-inner']
							
							shadow = core.cNode('div')
							shadow.className = 'shadow'

							s[arr[i]].appendChild(s[arr[i]+'-inner'])
							s[arr[i]].appendChild(shadow)
							s.parent.appendChild(s[arr[i++]])
						}
						s['frontPage'].addEventListener(transEndEventName,function(e){							
							s['frontPage'].style.display = 'none'
							s['backPage'].style.display = ''
							setTimeout(function(){
								s['backPage'].className += ' book-'+type+'-ani-step2'
							},20)
						},false)
						s['backPage'].addEventListener(transEndEventName,function(e){							
							s['backPage'].style.display = 'none'
							s['staticPage'].style.display = 'none'
							s.parent.parentNode && 
								s.parent.parentNode.removeChild(s.parent)
							animating = false
						},false)						
					}
					aniDomBuildFn(aniNode,'prev')
					aniDomBuildFn(aniNode,'next')					
					inited = true		
				}
			}
			,turnTo: function(i){
				var type = bookmark == i ? null   : 
						   bookmark  < i ? 'next' : 'prev'
					,page				
				if(pages.length-1 < i || i < 0){
					return false;
				}
				if(type && !animating){
					if(transName){
						animating = true;
						page = aniNode[type]
						page['staticPage'].className = css['ani-'+type]['staticPage']
						page['frontPage'].className  = css['ani-'+type]['frontPage']
						page['backPage'].className   = css['ani-'+type]['backPage']
						
						page['frontPage'].style.display   = page['backPage'].style.display   = page['staticPage'].style.display   = ''
						page['frontPage-inner'].innerHTML = page['backPage-inner'].innerHTML = page['staticPage-inner'].innerHTML = ''
						
						page['staticPage-inner'].appendChild(pages[bookmark].cloneNode(true)).style.cssText = ''
						page['frontPage-inner'].appendChild(pages[bookmark].cloneNode(true)).style.cssText  = ''
						page['backPage-inner'].appendChild(pages[i].cloneNode(true)).style.cssText          = ''
						
						node.appendChild(page.parent)
						
						setTimeout(function(){
							page['backPage'].style.display = 'none'
							page['frontPage'].className   += ' book-'+type+'-ani-step1'
						},20)
					}
					pages[bookmark].style.display = 'none';
					pages[i].style.display = '';
					return bookmark = i					
				}
			}
			,next: function(){
				return funcs.turnTo(bookmark+1)
			}
			,prev: function(){
				return funcs.turnTo(bookmark-1)
			}
		}

		,checkParam = function(){
			var  type = (typeof node).toUpperCase()
				,bookNode = type == 'OBJECT' && node.tagName ? node :
					    	type == 'STRING'                 ? core.byId(node) :
					    	false
			
			opt         = opt          || {}
			bookmark    = opt.bookmark || 0
			opt.width   = opt.width
			opt.height  = opt.height			
			return node = bookNode
		}
		
		,init = (function(){
			var it = {}
			if(checkParam()){				
				funcs.build()
				it.getBookmark = function(){return bookmark}
				it.turnTo      = funcs.turnTo
				it.next        = funcs.next
				it.prev        = funcs.prev
			}else{
				it = null
			}
			return it
		})()

	return init
}
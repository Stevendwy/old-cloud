import React from 'react'

export default class ShowImageViewModel {
	/**
	 * [areas areas]
	 * @param  {[array]} mapSource [map source]
	 * @param  {[function]} areaClick [area click]
	 * @return {[array]}           [areas]
	 */
	static areas(mapSource, scale, areaClick) {
		if(mapSource) return (
			mapSource.map((item, index) => {
				// console.log(scale)
				// console.log(item)
				let _coords = `
					${parseInt(item[0] || '0') * scale},
					${parseInt(item[1] || '0') * scale},
					${parseInt(item[2] || '0') * scale},
					${parseInt(item[3] || '0') * scale}`
				// console.log(_coords)
				return (
					<area key={index} shape="rect" coords={_coords}
						alt={index}
						onClick={() => areaClick(item[4] || 'null')}/>
				)
			})
		)
	}

	/**
	 * [imgInitialPosition img initial position]
	 * @param  {[dom]} img         [img dom]
	 * @param  {[object]} imgContainerSize [img container size]
	 * @param  {[number]} setScale    [scale]
	 */
	static imgInitialPosition(img, imgBox, imgContainerSize, setScale) {
		let _naturalWidth = img.naturalWidth
		let _naturalHeight = img.naturalHeight
		let _style = img.style

    //if no img, return
		if(_naturalWidth < 1) return

		// 如果图片宽高都比容器小, 什么都不要做
		if(_naturalWidth < imgContainerSize.width && _naturalHeight < imgContainerSize.height) {
      if(_naturalWidth < _naturalHeight) { // 高大于宽
        let _scale = imgContainerSize.height / _naturalHeight
        if(_naturalWidth * _scale > imgContainerSize.width) { // 缩放后宽依然大于容器
          _style.width = '100%'
					_style.height = 'auto'
					_scale = imgContainerSize.width / _naturalWidth
        }
        else {
          _style.height = '100%'
          _style.width = 'auto'
        }
        setScale(_scale)
      }
      else {
        _style.width = '100%'
				_style.height = 'auto'
				setScale(imgContainerSize.width / _naturalWidth)
      }
    }
		else {
			if(_naturalWidth >= _naturalHeight) {
				// console.log('w >= h')
				_style.width = '100%'
				_style.height = 'auto'
				setScale(imgContainerSize.width / _naturalWidth)
			}else {
				// console.log('w < h')
				let _scale = imgContainerSize.height / _naturalHeight
				//如果比例缩小后，宽依然大于容器
				if(_naturalWidth * _scale > imgContainerSize.width) {
					_style.width = '100%'
					_style.height = 'auto'
					_scale = imgContainerSize.width / _naturalWidth
				}else {
					_style.width = 'auto'
					_style.height = imgContainerSize.height + 'px'
				}
				setScale(_scale)
			}
		}

		//back initial position
		imgBox.style.top = '0'
		imgBox.style.left = '0'
	}

	/**
	 * [scaling scaling img]
	 * @param  {[dom]} img  [img dom]
	 * @param  {[object]} view  [handle view]
	 * @param  {[bool]} plus [is or is not plus]
	 */
	static scaling(img, view, plus) {
		let _scaling = 0.1

		if(plus) view.scale += _scaling
		else view.scale -= _scaling

		img.style.width = (img.naturalWidth * view.scale) + 'px'
		img.style.height = (img.naturalHeight * view.scale) + 'px'

		view.areas()
	}

	static mouse(img, view, e) {
		e.preventDefault() //移除默认事件，防止图片被拖动

		switch (e.type) {
			case 'mousedown' || 'touchstart':
				// console.log('mousedown')
				view.isMovingStatus = true
				view.moveStartStatus = {
					startX: e.hasOwnProperty('touches') ? e.touches[0].clientX : e.clientX, //判断是手指还是鼠标
					startY: e.hasOwnProperty('touches') ? e.touches[0].clientY : e.clientY,
					startTop: parseInt(img.style.top.replace('px', '')) || 0,
					startLeft: parseInt(img.style.left.replace('px', '')) || 0
				}
				break
			case 'mousemove' || 'touchmove':
				if(view.isMovingStatus) ShowImageViewModel.move(img, view, e)
				break
			case 'mouseup' || 'touchend':
				// console.log('mouseup')
				view.isMovingStatus = false
				break
			case 'mouseleave' || 'touchleave':
				// console.log('mouseleave')
				view.isMovingStatus = false
				break
			default:
				// console.log(type)
		}
	}

	static move(img, view, e) {
		let _currentX = e.hasOwnProperty('touches') ? e.touches[0].clientX : e.clientX //判断是手指还是鼠标
		let _currentY = e.hasOwnProperty('touches') ? e.touches[0].clientY : e.clientY

		img.style.top = _currentY - view.moveStartStatus.startY + view.moveStartStatus.startTop + 'px'
		img.style.left = _currentX - view.moveStartStatus.startX + view.moveStartStatus.startLeft + 'px'
	}
}

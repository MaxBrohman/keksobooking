//drag-n-drop.js

export const getAdress = (elem) => {
	document.querySelector('#address').value = `${(elem.getBoundingClientRect().left - elem.offsetWidth/2).toFixed(0)}, ${(elem.getBoundingClientRect().bottom + window.pageYOffset).toFixed(0)}`;
};
export default class DragNDrop{
	constructor(elem, field){
		this.elem = elem;
		this.field = field;
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.startCoords;
		this.elem.addEventListener('mousedown', this.onMouseDown.bind(this))
	}

	onMouseUp(evt){
		evt.preventDefault();
		getAdress(this.elem);
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	}
	//При нажатии сохраняются координаты клика 
	onMouseDown(evt){
		this.startCoords = {
			x: evt.clientX,
			y: evt.clientY
		};
	
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove(evt){
		evt.preventDefault();

		/*При движении мыши контролируется разница между начальными координатами и текущими координатами курсора*/
		const shift = {
			x: this.startCoords.x - evt.clientX,
			y: this.startCoords.y - evt.clientY
		};

		this.startCoords = {
			x: evt.clientX,
			y: evt.clientY
		};
		//Координаты элемента обновляются
		this.elem.style.top = (this.elem.offsetTop - shift.y) + 'px';
		//исключается выход за пределы элемента field
		if(parseInt(this.elem.style.top) < 0 + this.elem.clientHeight/2) {
			this.elem.style.top = 0 + this.elem.clientHeight/2 + 'px';
		}
		if(parseInt(this.elem.style.top) > this.field.clientHeight - this.elem.clientHeight) {
			this.elem.style.top = this.field.clientHeight - this.elem.clientHeight + 'px';
		}

		this.elem.style.left = (this.elem.offsetLeft - shift.x) + 'px';
		
		if(parseInt(this.elem.style.left) < 0 + this.elem.clientWidth/2) {
			this.elem.style.left = 0 + this.elem.clientWidth/2 + 'px';
		}
		if(parseInt(this.elem.style.left) > this.field.clientWidth - this.elem.clientWidth/2) {
			this.elem.style.left = this.field.clientWidth - this.elem.clientWidth/2 + 'px';
		}
	}
	//Возвращение к заданным в CSS координатам при переходе страницы в неактивное состояние
	reset(){
		this.elem.style.top = '';
		this.elem.style.left = '';
		getAdress(this.elem);
	}
};
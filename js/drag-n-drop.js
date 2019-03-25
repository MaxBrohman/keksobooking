//drag-n-drop.js
let dragged;
let startCoords;

export default class{
	constructor(elem, field){
		this.elem = elem;
		this.field = field;
		this.address = document.querySelector('#address');

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);

		this.elem.addEventListener('mousedown', this.onMouseDown)
	}
	onMouseUp(evt){
		evt.preventDefault();
		this.address.value = `${(this.elem.getBoundingClientRect().left - this.elem.offsetWidth/2).toFixed(0)}, ${(this.elem.getBoundingClientRect().bottom + window.pageYOffset).toFixed(0)}`;
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		if (dragged) {
			const clickPreventDefault = (evt) => {
				evt.preventDefault();
				this.elem.removeEventListener('click', clickPreventDefault)
			};
			this.elem.addEventListener('click', clickPreventDefault);
		}
	}

	onMouseDown(evt){
		startCoords = {
			x: evt.clientX,
			y: evt.clientY
		};
		dragged = false;
	
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove(evt){
		evt.preventDefault();

		dragged = true;

		const shift = {
			x: startCoords.x - evt.clientX,
			y: startCoords.y - evt.clientY
		};

		startCoords = {
			x: evt.clientX,
			y: evt.clientY
		};

		this.elem.style.top = (this.elem.offsetTop - shift.y) + 'px';

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
};
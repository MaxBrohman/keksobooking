//map-pin.js

export default class{
    constructor(options){
        this.pin = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
        this.pin.data = options;
        this.pin.style.left = options['location']['x'] - this.pin.offsetWidth/2 + 'px';
        this.pin.style.top = options['location']['y'] - this.pin.offsetHeight + 'px';
        this.avatar = this.pin.querySelector('img');
        this.avatar.src = options['author']['avatar'];
        this.avatar.alt = options['offer']['tittle'];
    }
    render(){
        this.pin.setAttribute('tabindex', '0');
        return this.pin;
    }
};
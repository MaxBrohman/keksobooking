//rooms-cap.js

export default class{
    constructor(){
        this.rooms = document.querySelector('#room_number');
        this.capacity = document.querySelector('#capacity');
        this.validate = new Event('validate');
        this.capacity.onmousedown = this.rooms.onmousedown = () => {
            this.capacity.onchange = () => {
                this.validateMain(this.capacity, this.rooms);
            };
            this.rooms.onchange = () => {
                this.validateMain(this.rooms, this.capacity);
            };
        };
        this.capacity.addEventListener('validate', () => {
            this.validateRelative(this.capacity);
        });
        this.rooms.addEventListener('validate', () => {
            this.validateRelative(this.rooms);
        });
    }

    checkRoomNumber(roomValue, guestsValue, elem){
        if(roomValue !== guestsValue){
            const invalid = `Вы не можете выбрать ${guestsValue} гостей для ${roomValue} комнат`;
            if((roomValue == 100 && guestsValue == 0) || 
            (roomValue == 3 && guestsValue != 0) || 
            (roomValue == 2 && (guestsValue < 3 || guestsValue > 0))){
                elem.style.borderColor = '#eee';
                elem.setCustomValidity('');
            } else {
                elem.style.borderColor = '#ff5635';
                elem.setCustomValidity(invalid);
            }
        } else{
            elem.style.borderColor = '#eee';
            elem.setCustomValidity('');
        }
    }
    validateRelative(relativeElem){
        this.checkRoomNumber(this.rooms.value, this.capacity.value, relativeElem);
        relativeElem.onchange = null;
    }
    validateMain(mainElem, relativeElem){
        this.checkRoomNumber(this.rooms.value, this.capacity.value, mainElem);
        const event = new Event('validate');
        relativeElem.dispatchEvent(event);
    }
};
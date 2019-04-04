//rooms-cap.js

/*Для того, чтобы изменение в любом из двух взаимосвязанных полей сообщалось во второе
 поле, создается кастомное событие validate, срабатывающее при изменении одного поля на
  другом.  */
export default class RoomsCap{
    constructor(){
        this.rooms = document.querySelector('#room_number');
        this.capacity = document.querySelector('#capacity');
        this.validate = new CustomEvent('validate');
        this.capacity.addEventListener('change', () => {
            this.validateMain(this.capacity, this.rooms);
        });
        this.rooms.addEventListener('change', () => {
            this.validateMain(this.rooms, this.capacity);
        });
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
            if((roomValue === '100' && guestsValue === '0') || 
            (roomValue === '3' && guestsValue !== '0') || 
            (roomValue === '2' && (guestsValue < 3 && guestsValue > 0))){
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
    }
    validateMain(mainElem, relativeElem){
        this.checkRoomNumber(this.rooms.value, this.capacity.value, mainElem);
        relativeElem.dispatchEvent(this.validate);
    }
};
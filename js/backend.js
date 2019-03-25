//backend.js

export default class {
    constructor(url, reject){
        this.url = url;
        this.reject = reject;
    }

    get(){
        const sendRequest = async () => {
            try{
                return await fetch(this.url).then(response => response.json());
            } catch(err){
                throw new Error(err.message);
            }
        };
        
        return sendRequest()
            .then(result => result)
            .catch(error => this.reject.render(`Не удалось загрузить объявления. Ошибка ${error.message}. Попробуйте перезагрузить страницу.`));
    }
    post(data){
        const sendData = async () => {
            try {
                return await fetch(this.url, {
                    method: 'POST',
                    body: data
                });
            } catch(err){
                throw new Error(err.message);
            }
        };
        sendData()
            .then(response => {
                if(response.ok) console.log(response);
            })
            .catch(error => this.reject.render(`Не удалось отправить данные на сервер. Ошибка ${error.message}. Попробуйте позже.`));;
    }
};
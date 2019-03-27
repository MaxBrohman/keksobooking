//file-loader.js
const MAX_FILES = 5;

export default class{
    constructor(loader, previews, mode){
        this.loader = loader;
        this.previews = previews;
        this.types = /\.(gif|jpe?g|png|svg)$/i;
        this.loader.addEventListener('change', () => {
            this.loadHandler();
        });
        this.mode = mode;
    }

    async loadHandler(){
        const files = this.loader.files;
        if(this.mode === 'use'){
            for (let i = 0; i < this.previews.length; i++){
                if(this.types.test(files[i].name)){
                    this.initUseReader(this.previews[i], files[i]);
                }
            }
        } else if(this.mode === 'create'){
            const max = files.length > MAX_FILES ? MAX_FILES : files.length;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < max; i++){
                if(this.types.test(files[i].name)){
                    await this.initCreateReader(files[i])
                    .then(img => {
                        fragment.appendChild(img);
                    });
                }
            }
            this.previews.appendChild(fragment);
        }
    }

    initUseReader(preview, file){
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            preview.src = reader.result;
        });
        reader.readAsDataURL(file);
    }

    initCreateReader(file){
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const img = document.createElement('img');
                img.src = reader.result;
                resolve(img);
            });
            reader.readAsDataURL(file);
        });
    }
}
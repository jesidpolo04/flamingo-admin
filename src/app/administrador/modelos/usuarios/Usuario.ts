export class Usuario{
    public id?:string
    constructor(
        public identificacion: string,
        public nombre: string,
        public usuario: string,
        id?:string
    ){
        this.id = id
    }
}

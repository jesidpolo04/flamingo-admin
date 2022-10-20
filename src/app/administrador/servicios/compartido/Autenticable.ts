export class Autenticable {
    public readonly llaveTokenLocalStorage = 'jwt'
    public constructor(){}
    public obtenerTokenAutorizacion():string{
        const token = localStorage.getItem(this.llaveTokenLocalStorage)
        if(token) return token;
        else throw new Error("No se encontró el token de autorización en el localStorage");
    }
}
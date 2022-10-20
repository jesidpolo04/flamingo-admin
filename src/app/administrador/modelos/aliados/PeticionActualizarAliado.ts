export class PeticionActualizarAliado{
    public orden: number
    public nombre: string
    public nit: number
    public comision: string
    public linkAmigable: string
    public logo: File
    public tiempo:number

    public constructor(orden:number = 1, nombre:string, nit:number, comision:string, linkAmigable:string, logo:File, tiempo:number){
        this.orden = orden
        this.nombre = nombre
        this.nit = nit
        this.comision = comision
        this.linkAmigable = linkAmigable
        this.logo = logo
        this.tiempo = tiempo
    }
}
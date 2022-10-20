export class PeticionActualizarCategoriaAliado{
    public imagen?:File
    public link_amigable_aliado?:string
    public destacada?:boolean
    public estado?:boolean
    public orden?:number

    public constructor(imagen?:File, linkAmigableAliado?:string, destacada?:boolean, estado?:boolean, orden?:number){
        this.imagen = imagen
        this.link_amigable_aliado = linkAmigableAliado
        this.destacada = destacada
        this.estado = estado
        this.orden = orden
    }
}


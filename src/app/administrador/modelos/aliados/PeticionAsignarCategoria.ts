export class PeticionAsignarCategorias{
    public imagen: File
    public categoriaId: string
    public aliadoId: string
    public linkAmigableAliado: string
    public destacada: boolean

    public constructor(imagen:File, categoriaId:string, aliadoId:string, linkAmigableAliado:string, destacada:boolean){
        this.imagen = imagen
        this.categoriaId = categoriaId
        this.aliadoId = aliadoId
        this.linkAmigableAliado = linkAmigableAliado
        this.destacada = destacada
    }
}
export class PeticionCrearAliado{
    public orden: number
    public nombre: string
    public nit: number
    public comision: string
    public linkAmigable: string
    public logo: File
    public tiempo: number
    public servicios?: string
    public quienesSomos?: string
    public whatsapp?: string
    public linea?: string
    public transaccional: boolean
    public imgModal: boolean
    public imgEscritorio?: File
    public imgMobil?: File
    public fiao: boolean
    public mefia: boolean

    public constructor(
        orden:number = 1, 
        nombre:string, 
        nit:number, 
        comision:string, 
        linkAmigable:string, 
        logo:File, 
        tiempo:number,
        transaccional: boolean = false,
        servicios?: string,
        quienesSomos?: string,
        linea?: string,
        whatsapp?: string,
        imgModal: boolean = false,
        imgEscritorio?: File,
        imgMobil?: File,
        fiao = false,
        mefia = false
    ){
        this.orden = orden
        this.nombre = nombre
        this.nit = nit
        this.comision = comision
        this.linkAmigable = linkAmigable
        this.logo = logo
        this.tiempo = tiempo
        this.transaccional = transaccional
        this.servicios = servicios
        this.quienesSomos = quienesSomos
        this.linea = linea
        this.whatsapp = whatsapp
        this.imgModal = imgModal
        this.imgEscritorio = imgEscritorio
        this.imgMobil = imgMobil
        this.mefia = mefia
        this.fiao = fiao
    }
}
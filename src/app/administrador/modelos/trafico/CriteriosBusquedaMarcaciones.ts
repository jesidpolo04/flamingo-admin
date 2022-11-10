export class CriteriosBusquedaMarcaciones {
    public constructor(
        public fechaInicial?:Date,
        public fechaFinal?:Date,
        public correoCliente?:string,
        public asesor?:string ,
        public aliadoId?:string ,
        public categoriaId?:string ,
        public termino?:string,
        public tipo?:number
    ){}
}
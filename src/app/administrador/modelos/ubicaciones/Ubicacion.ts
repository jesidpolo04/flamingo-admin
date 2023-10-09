export interface Ubicacion{
    id: string
    codigoDepartamento: string
    nombreDepartamento?: string
    codigoCiudad: string
    nombreCiudad?: string
    idAliado: string
    nombre: string
    latitud: number
    longitud: number
    estado: boolean
}
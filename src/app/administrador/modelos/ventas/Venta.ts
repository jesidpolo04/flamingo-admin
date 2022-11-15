export interface Venta {
    id: string
    ordenCompra: string
    fechaOrden: string
    valorTotal: number
    estado: boolean
    flete: number
    aliadoNombre: string
    aliado: string
    correos: string
    categorias: string[]
    productos: string
    asesorTrafico: string
    comision: number
}

export const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

export function formatearFecha(fecha: string | Date):string{
    if(typeof(fecha) === 'string'){
        const fechaDate = new Date(fecha)
        return `${fechaDate.getDate()} / ${fechaDate.getMonth() + 1} / ${fechaDate.getFullYear()}`
    }else{
        return `${fecha.getDate()} / ${fecha.getMonth() + 1} / ${fecha.getFullYear()}`
    }
}

export function establecerFecha(inputFecha:string, hora:number, minuto:number, segundo:number, milisegundo?:number): Date{
    if(inputFecha === ''){
        throw new Error('La fecha debe tener el formato yyyy-MM-dd')
    }
    const arregloFecha = inputFecha.split('-')
    const anio = parseInt(arregloFecha[0])
    const mes = parseInt(arregloFecha[1]) - 1
    const dia = parseInt(arregloFecha[2])
    const fecha = new Date()
    fecha.setFullYear(anio, mes, dia)
    fecha.setHours(hora, minuto, segundo, milisegundo ? milisegundo : 0)
    return fecha
}
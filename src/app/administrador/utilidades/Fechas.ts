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
        return `${fechaDate.getUTCDate()} / ${fechaDate.getUTCMonth() + 1} / ${fechaDate.getUTCFullYear()}`
    }else{
        return `${fecha.getUTCDate()} / ${fecha.getUTCMonth() + 1} / ${fecha.getUTCFullYear()}`
    }
}
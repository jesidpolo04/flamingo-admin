import { AbstractControl } from "@angular/forms";
export function requeridoSi(nombreOtroControl: string, valorOtroControl: string) {
    return (control:AbstractControl):{ [key: string]: any } | null => {
      const otroControl = control.parent!.get(nombreOtroControl)
      if(otroControl && otroControl.value == valorOtroControl ) return null;
      return { requeridoSi: true }
    }
  }
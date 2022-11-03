import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions, Chart } from 'chart.js';
@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit, AfterViewInit {
  @ViewChild('baseChart') canvas!:ElementRef
  public grafico?:Chart
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderizarGrafico()
  }

  public renderizarGrafico(){
    this.grafico = new Chart(this.canvas.nativeElement , {
      type: 'bar',
      data: {
        labels: ['Mabe', 'Tigo', 'Claro'],
        datasets: [{
          data: [1,2,3],
          backgroundColor: ['#4E73DF', '#36B9CC', '#1CC88A']
        }]
      },
      options: {
        plugins:{
          legend: {
            display: false
          }
        },
        scales: {
          xAxis: {
            grid:{
              display: false
            }
          }
        }
      },
    })
  }

}

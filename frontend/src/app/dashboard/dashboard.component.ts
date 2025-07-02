import { Component, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const chartDom = document.getElementById('salesChart');
    if (!chartDom) {
      console.error('Element #salesChart introuvable');
      return;
    }
    const myChart = echarts.init(chartDom);

    const option = {
      xAxis: {
        type: 'category',
        data: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330],
          type: 'line'
        }
      ]
    };

    myChart.setOption(option);
  }
}

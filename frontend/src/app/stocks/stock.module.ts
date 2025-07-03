import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StocksComponent } from './stocks.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [StocksComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [StocksComponent]
})
export class StockModule {}
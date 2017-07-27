import { NgModule } from '@angular/core'
import { downgradeComponent } from '@angular/upgrade/static'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MdButtonModule, MdCheckboxModule, MdCardModule } from '@angular/material'
import { HttpClientModule } from '@angular/common/http'

import { IndexNewsCardComponent } from './index-news-card/index-news-card.component'

@NgModule({
  imports: [
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  declarations: [
    IndexNewsCardComponent
  ],
  entryComponents: [
    IndexNewsCardComponent
  ]
})
export class FFXIVCrafterModule {
  constructor() {
  }

  downgradeComponents() {
    let meanModule = (<any>window).angular.module('mean.ffxivCrafter')
    meanModule.directive('indexNewsCard2',downgradeComponent({component: IndexNewsCardComponent}))
  }
}

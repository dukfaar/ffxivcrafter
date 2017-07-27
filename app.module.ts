import { NgModule, Component } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { UpgradeModule } from '@angular/upgrade/static'

import { FFXIVCrafterModule } from './packages/custom/ffxivcrafter/public/ffxivcrafter.module'

@NgModule({
	imports: [
		BrowserModule,
 	        UpgradeModule,
		FFXIVCrafterModule
	]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule, private ffxivCrafter: FFXIVCrafterModule) { }
  ngDoBootstrap() {
    this.downgradeComponents()

    this.upgrade.bootstrap(document.body, ['mean'], { strictDi: false });
  }
  downgradeComponents() {
    let meanModule = (<any>window).angular.module('mean')

    this.ffxivCrafter.downgradeComponents() 
  }
}



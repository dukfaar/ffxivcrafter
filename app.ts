import 'reflect-metadata'
import 'zone.js'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import {AjaxCall} from './ng1app.module'
import {AppModule} from './app.module'

AjaxCall()
platformBrowserDynamic().bootstrapModule(AppModule);

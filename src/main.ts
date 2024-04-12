/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { IConfig } from './app/core/interfaces/config/IConfig';

const config: IConfig = {
  apiUrl: 'http://localhost:30101',
  //apiUrl: 'https://localhost:44373'
};

sessionStorage.setItem('configSettings', JSON.stringify(config));
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

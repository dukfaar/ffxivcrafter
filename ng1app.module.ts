import * as jQuery from 'jquery'
(<any>window).$= jQuery

//Old AngularJS Stuff
import 'angular/angular-csp.css';
import 'angular-ui-select/select.min.css';
import 'angular-material/angular-material.min.css';

import * as angular from 'angular';
(<any>window).angular = angular

import 'angular-ui-select/select';
import 'angular-mocks';
import 'angular-cookies';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-jwt';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';

export function AjaxCall () {
	jQuery.ajax('/_getModules', {
  	dataType: 'json',
 	 async: false,
	  success: processModules
	});
}

export function processModules (modules) {
  var packageModules = ['ngCookies', 'ngResource', 'ui.router', 'ui.select', 'ngSanitize', 'ngMaterial'];
  var m;
  var mn;
  for (var index in modules) {
    m = modules[index];
    mn = 'mean.' + m.name;
    angular.module(mn, m.angularDependencies || []);
    packageModules.push(mn);
  }

/// <reference path="./webpack.d.ts" />
/// <reference path="./webpack-env.d.ts" />
  var req = require.context('./packages', true, /\/public\/(?!tests|assets|views)(.*)\.(js|ts)$/);
  req.keys().map(req);
  req = require.context('./node_modules', true, /\/meanio-(.*)\/public\/(?!tests|assets|views)(.*)\.js$/);
  req.keys().map(req);
  angular.module('mean', packageModules);
}

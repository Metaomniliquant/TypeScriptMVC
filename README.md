#TypeScriptMVC

**TypeScriptMVC** is an MVC implementation written in [TypeScript](http://www.typescriptlang.org/). The original goal of this framework is to provide a strongly typed MVC framework that generally reads like [ASP.Net MVC](http://www.asp.net/mvc/mvc5).

<div style="font-weight:bold; font-size: 70%">
VERSIONS
</div>

<div style="font-size: 70%;">
  <ul>
  	<li><span style="font-style: italic;">TypeScriptMVC Version 1.0 <span style="font-weight:bold;">(Development Stage)</span></span></li>
  </ul>
</div>

<div style="font-size: 70%; font-style:italic;">
**Note: TypeScriptMVC Version 1.0 is currently under development. Any code and explanations provided are subject to change and is not guaranteed to be accurate upon the time of reading. When Version 1.0 is released, official documentation will be provided.
</div>


## General Concepts

**TypeScriptMVC** was designed to feel like ASP.NET MVC. From Routing to ModelBinders, the familiar concepts used during development using ASP.NET MVC exist during development using **TypeScriptMVC**.

### Applications

As with ASP.NET MVC, use convention over configuration. In the below snippet, auto-identification of controllers is enabled by matching the application namespace (Demo) and the AppNamespace (Demo). It is thus recommended to have one application per AppNamespace.

<pre style='background-color:RGB(30, 30, 30);color:RGB(220, 220, 220);'>
<span style='color:RGB(86, 156, 214);'>module</span> Demo {
    <span style='color:RGB(212, 155, 96);'>"use strict"</span>;

    <span style='color:RGB(86, 156, 214);'>export class</span> AppConfig <span style='color:RGB(86, 156, 214);'>extends</span> MVC.AppConfigBase {
        <span style='color:RGB(86, 156, 214);'>public get</span> AppNamespace(): Object {
            <span style='color:RGB(86, 156, 214);'>return</span> Demo;
        }

        <span style='color:RGB(86, 156, 214);'>public get</span> RootPath(): <span style='color:RGB(86, 156, 214);'>string</span> {
            <span style='color:RGB(86, 156, 214);'>return</span> <span style='color:RGB(212, 155, 96);'>"../../"</span>;
        }
    }

    <span style='color:RGB(86, 156, 214);'>export class</span> DemoApplication <span style='color:RGB(86, 156, 214);'>extends</span> MVC.Application {
        <span style='color:RGB(86, 156, 214);'>public constructor</span>() {
            <span style='color:RGB(86, 156, 214);'>super</span>(<span style='color:RGB(86, 156, 214);'>new</span> AppConfig());
        }

        <span style='color:RGB(86, 156, 214);'>public</span> Application_Start(): <span style='color:RGB(86, 156, 214);'>void</span> {
            <span style='color:RGB(86, 156, 214);'>this</span>.Router.MapPath(
            	<span style='color:RGB(86, 156, 214);'>new</span> MVC.RouteDefinition(<span style='color:RGB(212, 155, 96);'>"/{controller}/{action}"</span>));
            <span style='color:RGB(86, 156, 214);'>this</span>.Router.MapPath(
            	<span style='color:RGB(86, 156, 214);'>new</span> MVC.RouteDefinition(<span style='color:RGB(212, 155, 96);'>"/{controller}/{action}/{id}"</span>));
        }

        <span style='color:RGB(86, 156, 214);'>public</span> Application_Error(): <span style='color:RGB(86, 156, 214);'>void</span> {
            <span style='color:RGB(86, 156, 214);'>var</span> routeData: MVC.IRouteData = <span style='color:RGB(86, 156, 214);'>new</span> MVC.RouteData();
            routeData.Add(<span style='color:RGB(212, 155, 96);'>"Error"</span>);
            routeData.Add(<span style='color:RGB(212, 155, 96);'>"Index"</span>);

            <span style='color:RGB(86, 156, 214);'>this</span>.Router.ProcessRoute(routeData);
        }
    }
}
</pre>

We have an <code>MVC.Application</code> implementation called <code>DemoApplication</code>. This application uses a custom <code>MVC.IAppConfig</code> implementation called <code>AppConfig</code> to specify a default controller action method and the root application namespace (hey, even ASP.NET has a config file).

The application contains other common concepts in ASP.NET MVC development such as defining routes and custom error handling.


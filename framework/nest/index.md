### 概述

NestJS 是一个基于 express 的 HTTP 服务框架（可选 fastify），但也直接向开发者暴露出他们的 API，以便于使用他们的第三方模块。

可以安装 @nestjs/cli 来创建一个 NestJS 项目，他默认启用 TS。项目中还包含了其他配置，如 prettier、eslint、jest 等。

```shell
pnpm add @nestjs/cli

nest new project-name

# --strict 选项会在项目中启用 TS 的严格模式
nest new project-name --strict
```

使用 NestFactory 类的静态方法 create 创建一个应用实例，并设置监听端口。即可启动一个 Nest 应用。其中 AppModule 是一个根模块，用来组织应用中的其他模块。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

Nest 使用 express 还是 fastify 作为 HTTP 服务框架，取决于你的配置。他们都是通过适配器实现的。如 @nestjs/platform-express 包提供了 express 的适配器，@nestjs/platform-fastify 包提供了 fastify 的适配器。理论上说，只要有对应的适配器，Nest 可以支持任何 HTTP 服务框架。上面的代码中，我们使用了默认的 express 适配器。如果要使用 fastify 适配器，可以这样：

```ts
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter()
);
```

为 create 方法传入第二个参数，其默认值是 express 适配器。而传入 create 方法的泛型，是因为在 app 上暴露出了底层框架的 API。你使用不同的底层框架，就需要传入不同的泛型。默认是 NestExpressApplication。

注意，当你不需要调用底层框架的 API 时，可以不指定泛型。

可以使用 `pnpm start` 启动项目，或使用 `pnpm start:dev` 来启动开发模式。在开发模式下，NestJS 会监听文件的变化，并自动重启服务。

### Controllers 控制器

控制器负责处理请求，并向客户端返回响应。

一个控制器可以包含多个路由，所以一般一个控制器用于定义一个功能模块的多个 API。

```ts
// plan.controller.ts

import { Controller, Get, Req } from "@nestjs/common";

@Controller("plan")
export class CatsController {
  @Get("index")
  findAll(@Body() createCatDto: any): string {
    return "This action returns all cats";
  }

  @Get("ended")
  findEndedList(): string {
    return "This action returns all ended cats";
  }
}
```

每个 Controller 类都需要使用 @Controller() 装饰器来注解。这个装饰器接受一个字符串参数，用来指定路由的**前缀**。如这里的 plan 前缀，那么这个控制器的所有路由都会以 /plan 开头。

findAll 方法使用 @Get('index') 装饰器来指定路由。这个装饰器接受一个字符串参数，用来指定请求的路径和方法即路由。即客户端访问 GET /plan/index 时，就会导航到这个控制器的这个方法。

findAll 方法中可以通过装饰器拿到请求体、请求头、请求参数等信息。如使用 @Body 获取请求体；使用 @Req() 装饰器来获取底层框架 Express 的请求对象。注意，底层框架的请求对象的类型需要由 @types/express 提供。还可以通过 @Res 拿到响应对象用来设置响应体。但是不推荐这种直接访问底层框架的 API 的方式，因为这样会降低 Nest 程序的可移植性，不能用其他底层框架了。所以大多数情况下，使用 @Body 和 @Query 等 NestJS 提供的装饰器就够了。

findAll 方法返回一个字符串，这个字符串会作为响应体返回给客户端。如果返回值是一个引用类型的值，会将其序列化为 JSON 字符串，基本类型的值会直接返回。

#### 设置路由

控制器中使用 @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), @Head() 等装饰器来指定请求方法。@All 可以处理所有类型的请求。

##### 动态路由

当客户端访问 GET /plan/1 时，会导航到这个方法。

可以通过 @Param() 装饰器来获取动态路由的参数。

一般动态路由要定义到所有静态路由之后，防止拦截到匹配静态路由的请求。

```ts
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

#### 获取请求对象

| 装饰器                   | 说明                                                |
| ------------------------ | --------------------------------------------------- |
| @Request()/@Req()        | 获取底层框架的请求对象                              |
| @Response()/@Res()       | 获取底层框架的响应对象                              |
| @Next()                  | 获取下一个中间件函数                                |
| @Session()               | req.session                                         |
| @Param(key?: string)     | req.params/req.params[key] 请求参数                 |
| @Body(key?: string)      | req.body/req.body[key] 请求体                       |
| @Query(key?: string)     | req.query/req.query[key] 请求查询                   |
| @Headers(name?: string)  | req.headers/req.headers[name] 请求头                |
| @Ip()                    | req.ip 客户端 IP 地址                               |
| @HostParam(key?: string) | 获取域名/获取域名中的动态部分（详见子域名路由部分） |

注意，@Req() 和 @Res() 装饰器获取的是底层框架的请求和响应对象，不推荐使用。推荐使用 @Body、@Params() 等与底层框架无关的装饰器。

注意，请求体的类型可以使用接口或类来声明，但 Nest 建议使用类。因为在讲 TS 编译为 JS 之后，接口会被完全删除，而类会被保留下来。Nest 中有一些特性如管道、拦截器、守卫等，这些特性需要在 **运行时** 使用类的元数据。所以使用类更好。

用来定义请求体和响应体的结构的类，通常叫做 DTO（Data Transfer Object）。所以这里的 CreateCatDto 就是一个 DTO，并以 Dto 结尾。

```ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

```ts
@Post()
create(@Body() createCatDto: CreateCatDto) {
return `This action adds a new cat with name ${createCatDto.name}`;
}
```

这里使用了验证管道，任何不在 CreateCatDto 中的属性都会被过滤掉。

```ts
@Post()
crate(@Body(new ValidationPipe({ whitelist: true })) createCatDto: CreateCatDto) {
  return `This action adds a new cat with name ${createCatDto.name}`;
}
```

#### 设置响应对象

在处理函数中返回的值，会作为响应体。注意，如果返回值是一个引用类型的值，会将其序列化为 JSON 字符串，基本类型的值会直接返回。

##### 设置响应头

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

##### 设置状态码

默认的状态码都是 200 除了 POST 方法，他的默认状态码是 201。 可以使用 @HttpCode() 装饰器来设置状态码。

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

##### 设置重定向

```ts
@Post()
@Redirect('https://nestjs.com', 301)
create() {
  return;
}
```

##### 设置失败的响应

成功的响应可以通过上述方式设置，那各种失败情况下的响应如何设置呢？

可以抛出一个 HttpException 异常或其子类如 BadRequestException、NotFoundException 等，这个异常会被全局异常过滤器捕获到，并返回一个适当的响应。

在抛出的 HttpException 异常中，可以设置响应码，响应体等内容。详见异常过滤器章节。

#### 子域名路由

子域名路由可以根据请求的主机（或子域名）来路由请求。例如，你可能有一个应用程序，其中 admin.example.com 路由到你的应用程序的管理员部分，而 user.example.com 路由到用户部分。即对应到两个控制器。

```ts
@Controller({ host: "admin.example.com" })
export class AdminController {
  @Get()
  index(): string {
    return "Admin page";
  }
}
```

URL 中的主机名可以包含动态部分，这些部分可以在运行时改变。这些动态部分被称为"令牌"。例如，你可能有一个服务，它为多个用户提供个性化的子域名，如 user1.example.com 和 user2.example.com。在这种情况下，user1 和 user2 是动态的部分，可以用一个令牌（如 :account）来表示。在处理请求的方法中使用 @HostParam() 装饰器来获取这个令牌。

```ts
@Controller({ host: ":account.example.com" })
export class AccountController {
  @Get()
  getInfo(@HostParam("account") account: string) {
    return account;
  }
}
```

这种模式的一个具体应用是在多租户应用中，每个租户可能有自己的子域名，你可以使用这种模式来为每个租户提供定制的服务。

### 服务 providers

providers 是什么？

在依赖注入系统中，被注入的一方叫做提供者。在 Nest 中，提供者可以是类、值、或者工厂函数。他们可以被注入到其他类中，用来实现一些功能。我们将一些封装业务逻辑的类作为 provider 时，这个 provider 可以叫做服务。将类作为 provider 通常需要使用 @Injectable() 装饰器注解。

本章节讨论的 provider 专指服务。其他 provider 信息参见 provider 章节。

服务是通过依赖注入的模式来访问，而不是在使用时创建一个新的实例。它是 Nest 中实现解耦和模块化的关键工具。

这种方式与创建新的实例有什么区别？

当程序启动时，模块中所有的依赖都会被解析，此时所有的 Provider、controller 都会被实例化并存储在依赖注入容器（IoC 容器）中。这样其他地方通过依赖注入访问 CatsService 时，都会使用存储的全局实例。这样可以避免在多个地方创建多个实例，保证了实例的唯一性。也就是说所有用它的地方访问的都是一个实例。

为什么需要 providers?

封装可重用的服务：你可以将一些常用的功能封装在一个服务中，然后在需要的地方注入这个服务。这样，你可以避免在多个地方重复相同的代码，使你的代码更易于维护。

实现模块化：在 Nest 中，每个模块都可以提供一些提供者，这些提供者只在这个模块中可用。这样，你可以将你的应用分割为多个模块，每个模块负责一部分功能，使你的代码更易于理解和管理。

为什么要使用依赖注入模式？

实现解耦：通过依赖注入，你可以降低你的代码之间的耦合度。例如，如果一个类需要使用另一个类的功能，你不需要在这个类中直接创建那个类的实例，而是可以通过依赖注入来获取那个类的实例。这样，如果那个类的实现发生了变化，你只需要修改那个类，而不需要修改使用那个类的所有地方。

提高测试性：通过依赖注入，你可以在测试时替换真实的依赖为模拟的依赖。这样，你可以在不影响其他代码的情况下测试你的代码，使你的测试更容易编写和执行。

:::tip
Nest 内部广泛应用了依赖注入这种设计模式，所以你需要再多个地方使用一个实例即可时，可以为参数传递一个类，当你需要特定的实例或实例化时，可以传递一个新的实例。这都是可以兼容处理的。
:::

NestJS 中广泛用到了面向对象的编程方式，我们应该遵循 SOLID 原则：

SOLID 原则是五个面向对象编程和设计的基本原则，它们是：

单一职责原则（Single Responsibility Principle）：一个类应该只有一个引起它变化的原因。这意味着一个类应该只负责一项职责。

开放封闭原则（Open-Closed Principle）：软件实体（类、模块、函数等）应该对扩展开放，对修改封闭。这意味着应该能够在不修改现有代码的情况下添加新功能。

里氏替换原则（Liskov Substitution Principle）：子类型必须能够替换它们的基类型。这意味着如果一个类是另一个类的子类，那么任何使用基类的地方都应该能够使用子类。

接口隔离原则（Interface Segregation Principle）：客户端不应该依赖它不需要的接口。这意味着一个类不应该被迫实现它不需要的接口。

依赖倒置原则（Dependency Inversion Principle）：高层模块不应该依赖低层模块，它们都应该依赖抽象。这意味着应该依赖抽象，而不是依赖具体的实现。

#### 使用 Provider

创建一个新的 provider：

```ts
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

在 Module 中注册这个 provider，和使用它的 controller:

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

在 CatsController 中通过依赖注入使用这个 provider，而不是在构造函数中创建一个新的 CatsService 实例。

```ts
@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

为什么在构造函数中的参数声明就能注入 CatsService 实例呢？

在构造函数中使用 private、protected 以及 public 修饰符声明参数时，TypeScript 会自动创建一个同名的实例变量，并将这个参数的值赋给这个实例变量。所以上面的构造函数相当于：

```ts
@Controller("cats")
export class CatsController {
  private catsService: CatsService;

  constructor(catsService: CatsService) {
    this.catsService = catsService;
  }

  // ...
}
```

Nest 会自动将 CatsService 实例注入到类的成员 catsService 中，这样你就可以在 CatsController 中访问 CatsService 实例了。

### Modules 模块

模块是一个使用 @Module() 装饰器注解的类。

每个应用程序至少有一个模块，即根模块。根模块是 Nest 用来构建应用程序图的起点。

每个模块都可以通过 @Module() 装饰器来定义一些元数据。

```ts
@Module({
  imports: [], // 导入其他模块，这些模块导出的 provider 将在本模块中注册后可用
  controllers: [], // 本模块的控制器列表
  providers: [], // 本模块的 Provider 列表，可以注册本模块的 Provider 也注册其他模块的 Provider
  exports: [], // 本模块想要导出的提供者列表，这些提供者可以被其他模块注入
})
export class AppModule {}
```

通常一组特定的功能可以封装为一个模块，模块间可以相互引用，注册并使用其他模块暴露出的 Provider。并且模块最终被根模块引用。形成一个树结构。

exports 参数还可以导出它自身导入的模块。即 exports 既可以导出自身的 Provider 也可以导出它导入的 Module。

模块本身只负责注册 Controller 和 Provider，和导入导出以实现模块化吗？

可以使用 @Global 装饰器将模块设置为全局模块，这样在其他模块中不需要再导入这个模块，就可以使用这个模块中的 Provider。

```ts
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

### 异常过滤器

Nest 带有一个内置的全局异常过滤器，负责处理应用程序中所有未处理的异常。当一个异常没有被你的应用程序代码处理时，它会被这个过滤器捕获，然后自动发送一个适当的用户友好的响应。

他会自动处理 HttpException 类型的异常，以及他的子类如 BadRequestException、NotFoundException 等。当一个异常无法识别时，会返回一个这样的响应：

```ts
{
  statusCode: 500,
  message: 'Internal server error'
}
```

#### 手动抛出异常

在 Nest 中，你可以使用内置的 HttpException 类来抛出标准的 HttpException。

```ts
@Controller("cats")
export class CatsController {
  @Get()
  findAll() {
    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

当这个异常被抛出时，Nest 的异常层会捕获它，并发送一个包含状态码 403 和错误消息"Forbidden"的响应。这样，当用户尝试访问/cats 路由时，他们会收到一个 403 Forbidden 的 HTTP 响应。

也就是说，当你抛出一个 HttpException 时，Nest 会自动将其转换为一个标准的 HTTP 响应。**可以用这种方式在不同的请求错误下返回不同的错误响应**

HttpException 接受两个参数：

- 第一个参数是响应体，可以是一个字符串或者是一个对象。其默认值是 `{ statusCode, message }` 传字符串时，会被合并到 message 属性上，传对象时，会覆盖默认的响应体。
  最终 Nest 会序列化这个对象为 JSON。并将其返回为 JSON 格式的响应体。statusCode 默认和第二个参数状态码相同。
- 第二个参数是响应状态码，使用 HttpStatus 这个枚举是最佳实践。
- 还有第三个可选的参数，它是接受一个对象，可以设置一个 `cause` 参数用来提供错误原因，这个 cause 对象不会被序列化到响应对象中，但是它对于日志记录非常有用，可以提供关于导致 HttpException 被抛出的内部错误的有价值的信息。

因为内置全局异常过滤器可以捕获 HttpException 类，以及他的子类的异常。所以有需要时，我们可以自定义个类继承 HttpException 类，实现自定义异常类型。也会被捕获到。

```ts
export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

#### 自定义的异常过滤器

可以自定义一个实现了 ExceptionFilter 类，并使用 @Catch 装饰器注解的类来自定义一个异常过滤器。他需要实现 catch 方法。

@Catch 装饰器的参数接受一个类型，表示捕获指定类型的异常。不传参数时，会捕获所有类型的异常。

需要在这个 catch 方法中使用底层平台的 request 和 response 方法自定义处理逻辑，并最终使用 response 设置一个响应对象。

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // 获取底层平台的响应对象
    const request = ctx.getRequest<Request>(); // 获取底层平台的请求对象
    const status = exception.getStatus(); // 拿到捕获的异常中的状态码

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

#### 绑定异常过滤器

异常过滤器可以使用 @UseFilters 为 Controller、Controller 中的方法绑定一个或多个过滤器。

```ts
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

@UseFilters 装饰器可以传递异常处理器这个类本身，也可以传递类的实例。建议使用类，因为会启用依赖注入模式，异常处理器的实例会被重用。

#### 绑定全局异常过滤器

会应用到整个程序中的每个路由中。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

这种方法定义的全局过滤器中不能注入依赖，因为这是在任何模块的上下文之外完成的。还有另一种方法可以注册全局过滤器。

```ts
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

这个新添加的 provider 中 provide 参数的值是 APP_FILTER，这是一个用于注册全局过滤器的常量。useClass 类用于指定异常过滤器。

注意，无论以这种方式注册到哪个模块上，异常过滤器都会应用到全局。但此时异常过滤器中只能注册本模块的 Provider。所以异常处理器依赖哪个模块的 provider 就注册到哪个模块上吧。

也可以使用 useFactory 方法在创建过滤器时有更多的灵活性。例如，你可以根据环境变量或配置文件来决定使用哪个过滤器。

```ts
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useFactory: () => new HttpExceptionFilter(),
    },
  ],
})
```

注册全局异常处理器时，应该先注册捕获所有异常的过滤器，再是特定异常的过滤器。否则特定类型的异常不能被特定类型的过滤器捕获到。

#### 拓展内置的全局异常过滤器

自定义一个类继承 BaseExceptionFilter 类。在执行完自定义逻辑后，调用 super.catch 方法来继续内置的异常处理逻辑。

```ts
import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 自定义代码
    super.catch(exception, host);
  }
}
```

### middleware 中间件

中间件是一个在路由处理函数之前执行的类或函数。它可以获取请求和响应对象和下一个中间件函数。可以用于修改请求对象，记录请求，验证用户身份，结束请求，处理请求数据等操作。

使用类声明中间件时，他需要实现 NestMiddleware 接口。使用类的优势在于可以注入其他的 provider。

如果在一个中间件中没有结束请求，则需要调用 next() 方法调用下一个中间件。

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

我们通过类实现一个中间件，他需要实现 NestMiddleware 接口，并实现 use 方法。use 方法接受三个参数，分别是请求对象、响应对象和下一个中间件函数（都是底层框架的原生对象）。在 use 方法中，我们可以对请求对象和响应对象进行操作，也可以调用 next() 方法调用下一个中间件。

因为我们使用了 @Injectable 装饰器，它可以方便的注入其他 Provider 来实现更多功能。

#### 注册中间件

可以为模块实现 NestModule 方法，然后在 configure 方法中注册中间件。

```ts
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "cats", method: RequestMethod.GET });
  }
}
```

apply 方法接受多个参数，即为指定路由注册多个中间件，这些中间件会按顺序执行。

forRoutes 方法用来指定应用中间件的路由。当不传参数时至应用到当前模块的 Controller 的路由，传递参数会在整个程序中应用到指定路由。你注册到哪个模块都行？？？这对吗？？？

- forRoutes(): 应用到当前模块注册的 Controller 中的所有路由
- forRoutes('\*')：应用到所有的路由
- forRoutes('cats')：应用到所有的 /cats 路由
- forRoutes('cats', 'dogs')：应用到所有的 /cats 和 /dogs 路由
- forRoutes({ path: 'cats', method: RequestMethod.GET })：应用到所有的 GET /cats 路由,对象可以传多个。
- forRoutes({ path: 'cats', method: RequestMethod.ALL })：应用到所有的 /cats 路由
- forRoutes({ path: 'ab*cd', method: RequestMethod.ALL })：应用到所有的 /ab*cd 路由
- forRoutes(CatsController, DogsController)：应用到 CatsController, DogsController 中的所有路由

exclude 方法排除一些路由，不应用中间件。

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST },
    "cats/(.*)"
  )
  .forRoutes(CatsController);
```

#### 函数中间件

你也可以使用函数声明一个中间件，其参数是请求对象、响应对象和下一个中间件函数。

注册方法和类的方式一样。

当一个中间件不需要其他的 provider 作为依赖，可以使用函数的方式。

### pipes 管道

管道一种实现 PipeTransform 接口的类。

管道的作用：

- 转换输入数据：将输入的数据转换为所需的形式（例如，从字符串到整数）
- 验证：评估输入数据，如果有效，简单地原样传递；否则，抛出异常，会被异常过滤器捕获。

管道是对 Controller 的路由处理方法的参数进行操作。他会在方法被调用之前插入一个管道，之后方法被调用，并带有转换后的参数。如果管道执行失败，他应该抛出一个错误，会被异常过滤器捕获到并自动给客户端返回一个适当的响应。这样路由处理方法就不再执行了。

这跟中间件有什么区别？？

中间件和管道都是在路由处理方法之前执行。但中间件是对请求和响应对象进行操作，而管道是对请求参数进行操作。

客户端 -> 中间件 -> 管道 -> 路由处理方法

为什么要使用管道来校验参数呢，不是已经为参数定义了类型吗？

因为 TS 只在编译时检查类型，而不是在运行时。所以在运行时，你需要一个管道来校验参数。

#### 内置管道

Nest 内置了一些管道，如 ValidationPipe、ParseIntPipe、ParseArrayPipe、ParseBoolPipe、ParseUUIDPipe、ParseEnum 等。

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

ParseIntPipe 会将 id 转换为一个整数。如果 id 不可以被转换为整数，会抛出一个 BadRequestException 异常。被异常过滤器捕获后返回相应的响应给客户端。

#### 自定义管道

注意，内置的 ValidationPipe 的功能非常丰富，一般不需要自定义管道。

自定义管道时代码可以分为两个主体：

- 定义转换、校验逻辑
- 成功后返回转换后的值，失败则抛出异常

如这个案例中校验了请求体中 value、age 字段是否存在，和 age 字段是否是数字：

```ts
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.name || !value.age || typeof value.age !== "number") {
      throw new BadRequestException("Invalid input");
    }
    return value;
  }
}
```

transform 方法接受两个参数：

- 要处理的参数的值。
- 参数的元数据。

```ts
export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom"; // 参数是从哪个装饰器中提取的，是@Body()还是@Query()还是@Param()还是自定义的
  metatype?: Type<unknown>; // 参数的数据类型
  data?: string;
}
```

除了自定义检验逻辑外，还可以使用一些第三方库：

- 使用 zod 库

```shell
pnpm add zod
```

使用 zod 声明校验规则：schema 是模式的意思。

```ts
import { z } from "zod";

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

自定义一个管道，接受一个 zod 的 schema 实例作为实例化参数，注意这里不是在依赖注入。因为这个类没有使用 @Injectable 装饰器。

调用 schema 的 parse 方法来验证数据，如果验证失败，会抛出一个异常。

```ts
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException("Validation failed");
    }
  }
}
```

使用 @UsePipes() 装饰器绑定自定义管道到路由处理方法，并为自定义管道传入自定义的 schema 实例。

看名字也知道这个装饰器可以绑定多个管道`:)`

```ts
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- 使用 class-validator 、class-transformer 库

class-validator 库可以提供基于装饰器的验证。如 @IsNotEmpty() 表示字段不能为空，@IsString() 表示字段必须是字符串类型，@IsOptional() 表示字段是可选的。

```ts
import { IsString, IsInt } from "class-validator";

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsOptional()
  breed?: string;
}
```

自定义管道：

- 首先校验 metatype 是否存在和是否是原生类型，如果是则不校验。因为 metatype 的类型就是我们上面自定义的类，所以是原生类型时考试没有为参数设置为校验类，也就没有必要校验了。
- 使用 plainToInstance 将参数转换为 metatype 类型的实例。
- 使用 validate 函数校验转换的实例会否符合他的类型。不符合则校验失败。

```ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

绑定管道: 将自定义管道绑定到路由处理方法的参数上，其中 CreateCatDto 就是添加了校验装饰器的类，同时也是自定管道中 metatype 的值。

```ts
@Post()
async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

#### 全局管道

全局管道会应用到整个应用程序中的每个路由处理方法的参数上。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

与异常过滤器类似，这种方式注册的全局管道无法注入依赖。所以还有另一种方式注册：

```ts
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

自定义管道只能通过 @UsePipes 注册吗？

通常不需要自定义管道，而是使用 validattionPipe 是什么意思？他的功能和可配置性很强？

NestJS 中广泛应用了依赖注入模式，你可以在各种场景如装饰器的参数，使用其他类时传入类，NestJS 内部会自动启用依赖注入。当然也可以传入一个实例，可以根据需求选择。

### Guards 守卫

一个守卫是一个用 `@Injectable()` 装饰器注解的类，它实现了 `CanActivate` 接口。

守卫是用来进行授权，或者说身份验证操作的。为什么不用中间件进行身份验证？？

守卫在所有中间件之后，管道之前执行。

声明守卫：

```tsx
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

- canActivate 方法需要同步或异步地返回一个布尔值，表示当前请求是否被允许。
- context 参数是一个 ExecutionContext 实例，它包含了当前请求的一些信息，如请求对象、响应对象、处理器、路由等。

当返回 false 即请求不被允许时，NestJS 内部会自动抛出一个异常：ForbiddenException。这个异常会被异常过滤器捕获到，并返回一个适当的响应给客户端。

绑定守卫：

和管道和异常过滤器一样，守卫可以在控制器范围、路由处理方法范围、全局范围注册使用。同理，即可以使用类来启用依赖注入模式，或者传入一个实例。

```ts
@Controller("cats")
@UseGuards(RolesGuard)
export class CatsController {}
```

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

```ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

案例：基于角色的守卫

例如，CatsController 可能对不同的路由有不同的权限方案。有些可能只对管理员用户开放，而其他的可能对所有人开放。我们为特定路由指定一个角色，并根据客户端发来的请求体中的身份信息在守卫中判断是否符合路由的角色，符合则通过。

声明一个自定义的装饰器，接受一个字符串数组作为参数：

```ts
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();
```

为路由方法绑定装饰器：指定角色。

```ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

声明守卫：在 canActivate 方法中通过 Reflector 类的 get 方法获取路由方法上的角色信息，然后根据用户的角色信息判断是否有权限访问。

```ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

绑定守卫：这样控制器中的每个路由方法都会触发这个守卫，并根据路由方法上的角色信息判断是否有权限访问。

```ts
@Controller("cats")
@UseGuards(RolesGuard)
export class CatsController {}
```

### Interceptors 拦截器

拦截器是一个使用 @Injectable() 装饰器注解的类，他实现了 NestInterceptor 接口。

每个拦截器都要实现 intercept 方法，这个方法接受两个参数：

- context：ExecutionContext 实例，包含了当前请求的一些信息，如请求对象、响应对象、处理器、路由等。与守卫的 context 参数相同。
- next：CallHandler 实例，用来调用下一个拦截器或路由处理方法。

我们可以在拦截器中手动调用下一个拦截器或路由处理方法。这意味着可以自定义路由方法之前的逻辑，如果我们不调，那么路由处理方法就不会被调用。因为 next.handle() 方法返回的是一个 Observable 对象。所以我们可以拿到路由处理方法的返回值，对其进行处理。这意味着也可以自定义路由方法之后的逻辑。

所以，拦截器的作用在于：

- 在方法执行前/后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据特定条件完全覆盖函数

#### 声明拦截器：

在路由处理方法之前打印日志。

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

#### 绑定拦截器：

拦截器同样也可以绑定到控制器、路由处理方法、全局范围。

```ts
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

```ts
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

### 装饰器

通过装饰器可以无需修改原始的代码定义，就能拓展它的行为。并且这种拓展行为是可组合和复用的。

可以为类、类的属性和方法、类方法的参数声明装饰器。

装饰器的定义是一个函数，它默认存在三个参数：

当装饰器注解的是一个类时，只有一个参数：target。代表被装饰的类的构造函数。

当装饰器注解的是一个类的属性或方法时，存在三个参数：target、key、descriptor。target 代表被装饰的类的原型对象，key 代表被装饰的属性或方法的名称，descriptor 代表被装饰的属性或方法的描述符对象。就是 `Object.defineProperty` 的第三个参数。

- value: 被装饰得值
- writable: 是否可写
- enumerable: 是否可枚举
- configurable: 是否可配置

当装饰器注解的是一个方法的参数时，也存在三个参数：target、key、parameterIndex。target 代表被装饰的类的原型对象，如果你的方法是静态方法，那么 target 就是类的构造函数；key 代表被装饰的方法的名称；parameterIndex 代表被装饰的参数的索引。

使用这三个参数就可以实现通过原型对象为类添加属性和方法、通过描述符对象修改或拓展属性或方法的行为。

装饰器都是在类声明时就会被调用，即它是在编译时调用的，而不是运行时。

注解类的装饰器通常是在原型对象上添加、修改、覆盖属性和方法。

```ts
function (constructor: Function) {
  constructor.prototype.greet = function() {
    return 'hello';
  }
}

@Greeter()
class Greeting {
  constructor() {
    // 内部实现...
  }
}
```

当装饰器需要传入参数时，可以将装饰器函数返回一个函数，这个函数接受装饰器的参数。

```ts
function Greeter(greeting: string) {
  return function (constructor: Function) {
    constructor.prototype.greet = function () {
      return greeting;
    };
  };
}

@Greeter("Hello, world!")
class Greeting {
  constructor() {
    // 内部实现...
  }
}
```

注解类的属性或方法的装饰器通常是在描述符对象上修改或拓展属性或方法，甚至定义一个新的描述符对象。此时装饰器函数需要返回修改了的描述符对象或新的描述符对象。

属性只读装饰器：

```ts
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class MyClass {
  @readonly
  myValue = 10;
}
```

计算方法执行时间的装饰器：

```ts
function time(target, name, descriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args) {
    const start = Date.now();
    const result = original.apply(this, args);
    const end = Date.now();
    console.log(`"${name}" took ${end - start}ms to run.`);
    return result;
  };
  return descriptor;
}

class MyClass {
  @time
  myMethod() {
    // Some time-consuming operation...
  }
}
```

注解类方法的参数的装饰器通常是在方法上添加关于这个参数的元数据。并配合注解方法的装饰器读取元数据来实现：数据校验、类型检查、数据转换等功能。

```ts
import "reflect-metadata";

// 在调用方法时，就会检验方法的元数据的中索引是否存在与传入方法的参数中

function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  let method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let requiredParameters: number[] =
      Reflect.getOwnMetadata("required", target, propertyKey) || [];
    for (let parameterIndex of requiredParameters) {
      if (args[parameterIndex] == null) {
        throw new Error(`Argument ${parameterIndex} is required`);
      }
    }
    return method.apply(this, args);
  };
}

// 使用 Reflect.getOwnMetadata 方法获取方法的元数据，把参数的索引添加进去，使用 Reflect.defineMetadata 方法为方法的参数添加元数据

function required(target: any, propertyKey: string, parameterIndex: number) {
  let requiredParameters: number[] =
    Reflect.getOwnMetadata("required", target, propertyKey) || [];
  requiredParameters.push(parameterIndex);
  Reflect.defineMetadata("required", requiredParameters, target, propertyKey);
}

class MyClass {
  @validate
  myMethod(@required name: string, age: number) {
    // ...
  }
}
```

### Nest 中的装饰器

### 总结

组成 Nest 应用的三个基本部分：Module、Controller、Provider（服务）。

存在异常过滤器来捕获程序中的异常，所以可以在请求处理方法中主动抛出异常，来实现返回不同的错误信息。

存在中间件、守卫、管道、拦截器来对请求过程中的请求、响应、参数进行处理。他们都需要使用 @Injectable 装饰器注解，是因为他们一般都要注入其他 provider，还是因为他们要注入到其他位置（他们都通过其他装饰器注入了，而不是在构造函数里）？这和下面的问题相关。

@Injectable() 装饰器表示可注解到其他位置，还是可以接受注入？？？

## 第二部分

### Provider

在依赖注入系统中，被注入的一方叫做提供者。在 Nest 中，提供者可以是类、值、或者工厂函数。他们称为可注入对象，可以被注入到其他类中，用来实现一些功能。

注册 Provider 简写：如果一个类使用了 @Injectable() 装饰器注解，那就可以在 @Module() 装饰器参数的 providers 字段中直接将这个类注册为 provider。

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
```

:::tip
并不是只有使用 @Injectable() 注解的类才能成为 provider，只是它能够被更方便地注册为 provider，所以需要注入的类一般都使用 @Injectable() 装饰器注解。如中间件、守卫、拦截器、管道等。
:::

以完整的对象的方式注册 Provider：

```ts
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

provide 属性表示正在注册的 Provider 的令牌，它是一个唯一标识符。第二个参数是要注入的内容，可以使用 useClass、useFactory、useValue。在被注入方解析到令牌时，会从 IoC 容器中拿到如 useClass 指向的类的实例，如果没有则创建一个。如果没有为 provider 设置作用域的话，那么整个程序中注入的 provider 都是同一个实例。

注意，之前注册全局异常过滤器、全局管道时就使用了对象语法。他们能成为全局是因为 provide 字段使用内置的常量，这使他们成为全局 Provider。而不是只要使用这种对象语法就会成为全局 Provider。

#### 使用 useClass 注册 Provider

接受一个类。

```ts
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

除了将类名作为令牌外，还可以将字符串、Symbol、TS 中的枚举作为令牌值。

```ts
@Module({
  providers: [
    {
      provide: "CONNECTION",
      useClass: CatsService,
    },
  ],
})
export class AppModule {}
```

使用字符串时需要使用 @Inject() 装饰器注入 Provider

```ts
@Injectable()
export class CatsRepository {
  constructor(@Inject("CONNECTION") cats: CatsService) {}
}
```

useClass 也能实现动态注册 Provider：

```ts
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === "development"
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

#### 使用 useFactory 注册 Provider：

useFactory 属性接受一个工厂函数，这个函数返回一个 Provider 的实例。 可以在工厂函数中计算返回指定的 Provider 实例以实现动态注册 Provider。

工厂函数可以注入 Provider 用于内部的计算。

```ts
const connectionProvider = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],

@Module({
  providers: [
    connectionProvider,
    OptionsProvider,
    // { provide: 'SomeOptionalProvider', useValue: 'anything' },
  ],
})
export class AppModule {}
```

使用 useFactory 实现异步注册 Provider：

使用 async/await 语法将工厂函数声明为异步函数，它会返回一个 Promise。这样任何依赖于这个 Provider 的类都会等待这个 Promise 的解析完成后才会实例化。

在下面的例子中，createConnection 表示连接服务器，如果你有一个服务依赖于这个 'ASYNC_CONNECTION' 提供者，那么这个服务将等待数据库连接建立后才会被实例化。这可以确保当你的服务开始运行时，数据库连接已经准备就绪。

```ts
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

#### useValue 注册 Provider

我们还可以注入任意值。如常量、外部的库等

这里注入了一个自定义的对象，用于临时模拟真实的 Provider。

```ts
import { CatsService } from "./cats.service";

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```

#### 使用 useExisting 创建别名

使用 useExisting 属性为注册的 Provider 创建别名，这样就可以有多种方式访问到同一个 provider 。

在下面的例子中，既可以使用 `LoggerService` 也可以使用 `AliasedLoggerService` 访问到 `LoggerService` 实例。

```ts
const loggerAliasProvider = {
  provide: "AliasedLoggerService",
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

#### 导出对象语法注册的 Provider

在 @Module 装饰器中，可以使用 exports 属性导出 Provider。其值为一个数组，数组中的每一项都是一个 Provider 的令牌（即 provide 属性的值），或者一个 provider 对象（即 { provide: 'xx', useClass: 'xx' }）。

```ts
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === "development"
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
  exports: [configServiceProvider],
})
export class AppModule {}
```

### 注入作用域

#### Provider 的生命周期

在 Nest 中，几乎所有的东西（如数据库连接池、单例服务等）都是在所有请求之间共享的。这是因为 Node.js 并不是为每个请求创建一个单独的线程来处理，所以使用单例实例是安全的。

但是我们可以通过设置 provider 的 scope 属性来控制 provider 的生命周期。

- DEFAULT： provider 的单个实例在整个应用程序中共享。实例的生命周期直接与应用程序的生命周期绑定。一旦应用程序启动，所有的单例提供者都已经被实例化。即只会在 全局的 IoC 容器中实例化一次。
- REQUEST：实例在一个请求中共享。为每个传入的请求专门创建提供者的新实例。请求处理完成后，实例将被垃圾回收。不会存在于 IoC 容器中，而是在每次请求创建的 DI 子树中。
- TRANSIENT：每次注入都会创建一个新的实例。

第二个和第三个有什么区别？

前者在处理同一个请求的过程中，无论在哪里注入这个提供者，你都会得到同一个实例。后者这意味着在同一个请求中，如果你在两个不同的地方注入了一个 "TRANSIENT" 范围的提供者，你会得到两个不同的实例。

在 REQUEST 下，即使使用类注入一个 Provider，也会在每次请求中创建一个新的实例吗？

对。

设置 scope 属性：

```ts
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

对于自定义 Provider：

```ts
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

#### Controller 的生命周期

和 Provider 一样，Controller 也有生命周期。设置方式是一样的：

```ts
@Controller({
  path: "cats",
  scope: Scope.REQUEST,
})
export class CatsController {}
```

此时，任何匹配到 /cats 路由的请求都会创建一个新的 CatsController 实例。

为控制器设置 scope 有什么用？

如果你将控制器的范围设置为 Scope.REQUEST，你可以在控制器实例中保存请求级别的状态，比如请求的身份验证信息或其他上下文信息。请求处理完成后，这个实例就会被销毁，这样可以防止状态泄露到其他请求。

#### REQUEST 生命周期的影响

REQUEST 范围会沿着注入链向上冒泡。依赖于请求范围提供者的控制器本身也将是请求范围的。

想象以下依赖关系图：CatsController <- CatsService <- CatsRepository。如果 CatsService 是请求范围的（其他的都是默认的单例），那么 CatsController 也会变成请求范围的，因为它依赖于注入的服务。CatsRepository，因为没有依赖，所以仍然是单例范围的。

这就意味着程序中可能会存在大量隐式的 REQUEST 范围的 provider 和 controller。这可能会影响程序的性能。

#### REQUEST 生命周期访问请求对象

当使用请求范围的提供者时，你可能希望访问原始请求对象的引用。你可以通过注入 REQUEST 对象来实现这一点。

REQUEST 提供者本身也是请求范围的。

```ts
import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

#### TRANSIENT 生命周期获取实例化时所在的类

可以通过注入 INQUIRER 来获取 provider 实例化时所在的类。

```ts
import { Inject, Injectable, Scope } from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";

@Injectable({ scope: Scope.TRANSIENT })
export class HelloService {
  constructor(@Inject(INQUIRER) private parentClass: object) {}

  sayHello(message: string) {
    console.log(`${this.parentClass?.constructor?.name}: ${message}`);
  }
}
```

#### 耐用 Provider

如果一个 provider 被设置为 REQUEST 范围，那依赖他的 provider 或 controller 就会隐式地成为 REQUEST 范围。这在处理大量请求时，大量的实例化会影响程序的性能。

DI 子树，是指一个 controller 中依赖的 provider 组成的树结构。每接收到一个客户端发起的请求时，都会解析这个 controller 依赖的 provider 创建一个 DI 子树。如果 provider 的 scope 为 DEFAULT ，会从 Ioc 容器中获取。而为另外两种时，会在 IoC 容器中创建一个新的实例并返回。

如果 provider 需要在每次请求时根据请求对象中的条件地决定一些操作，可以将其设置为 REQUEST 范围。但是如果条件是固定的几种的情况下，我们可以在 REQUEST 范围的基础上，将 provider 设置为耐用 provider。注意，依赖它的 provider 也会变为耐用的。

将 provider 设置为耐用 provider：

```ts
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST, durable: true })
export class CatsService {}
```

或者在自定义 provider 中设置：

```ts
{
  provide: 'foobar',
  useFactory: () => { ... },
  scope: Scope.REQUEST,
  durable: true,
}
```

我们可以将 DI 子树保存起来，并制定一个策略，当满足某种条件时，就使用之前创建过的 DI 子树，而不是新创建一个。在这个重用的 DI 子树中，耐用 provider 的实例会被重用，非耐用 provider 会被重新创建。

声明这个策略需要实现 ContextIdStrategy 类，其中 attach 方法接受两个参数，第一个是当前的 contextId，第二个是请求对象。在 attach 方法中，我们根据请求头中的 tenantId 来查找缓存的 DI 子树的 contextId。attach 方法法返回一个函数，这个函数接受一个 HostComponentInfo 对象，返回一个新的 contextId。这个函数会在创建 DI 子树时调用，决定使用之前的还是新的 DI 实例。

不懂？？这里的 info.isTreeDurable 是谁决定的？？？

```ts
import {
  HostComponentInfo,
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
} from "@nestjs/core";
import { Request } from "express";

const tenants = new Map<string, ContextId>();

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {
    const tenantId = request.headers["x-tenant-id"] as string;
    let tenantSubTreeId: ContextId;

    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId);
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // If tree is not durable, return the original "contextId" object
    return (info: HostComponentInfo) =>
      info.isTreeDurable ? tenantSubTreeId : contextId;
  }
```

注册这个策略：

```ts
ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
```

### 循环依赖

两个类相互依赖时，就形成了循环依赖。

当出现循环依赖时，会导致无限循环的问题（如果两个类相互依赖，那么它们会无限循环地初始化对方），所以应该尽量避免相互依赖的情况出现。

当相互依赖不可避免时，使用 forward reference 前向引用来避免循环依赖导致的问题。

例如，类 A 需要类 B，而类 B 也需要类 A。这种情况下，由于两个类都还未完全定义，所以无法直接在一个类中引用另一个类。而前向引用允许我们在类的定义尚未完成时就引用它。这样，即使两个类互相依赖，我们也可以在一个类中引用另一个类。

使用 @Inject() 装饰器和 forwardRef() 函数在类 A 中引用类 B，在类 B 中引用类 A。即双方都要使用 forwardRef() 函数引用对方。

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService
  ) {}
}
```

```ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService
  ) {}
}
```

同样也可以使用这种方式解决模块间的循环依赖问题。

```ts
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}
```

```ts
@Module({
  imports: [forwardRef(() => CommonModule)],
})
export class CatsModule {}
```

### 模块引用

可以通过注入 ModuleRef 来获取当前模块及其依赖的模块中的 provider、controller 以及任何可注入对象（如守卫、拦截器等）。之后统称为可注入对象。

ModuleRef 实例有一个 get 方法，接受可注入对象的令牌，检索当前所在模块及其依赖的模块中的可注入对象的实例并返回，而不需要手动注入他们。

有什么用？

这使得你可以在运行时动态地获取和使用提供者，而不需要在编译时就确定所有的依赖关系。这对于实现某些高级特性，如插件系统或动态模块，非常有用。

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

注意，只能使用 get 方法获取全局作用域的可注入对象实例，不能获取请求作用域和瞬态作用域的。

如果一个可注入对象，不在当前模块中，但在全局上下问可用。可以使用 get 方法的第二个参数，传入一个可选的选项对象，设置 strict 为 false。此时，如果当前模块中没有，就会从全局上下文查找。

这里的全局上下文值得是什么？文档中也说了全局上下文，例如被注册到了其他模块中。这是什么意思，可以访问其他模块的 provider 吗？

```ts
this.moduleRef.get(Service, { strict: false });
```

使用 ModuleRef.resolve 方法获取请求和瞬态作用域可注入对象，其第一个参数和 get 方法一样。但其返回一个 Promise，解析值为可注入对象的实例。

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

那 get 方法和 resolve 方法有什么区别？

get 方法是同步的，它会从 IoC 容器中获取可注入对象的实例。resolve 方法是异步的，他会创建一个 DI 子树，并实例化可注入对象。

对于全局作用域的 provider ，就用 get 方法。而请求和瞬态作用域的 provider 不存在于 IoC 容器中，所以使用 resolve 方法重新创建。对于全局和瞬态的 provider 都符合其作用域定义。但请求作用域的 provider 并没有获取到客户端请求时创建的实例，而是重新创建了一个实例。

注意，每次调用 resolve 方法都会创建一个新的 DI 子树并实例化 provider。这也意味着使用 resolve 方法多次获取同一个 provider 会创建多个实例。

那如何获取客户端请求时创建的 DI 子树上的请求作用域的实例，而不是创建一个新的呢？

如果当前 provider 也是一个请求作用域的 provider ，那可以通过注入请求对象来获取客户端请求时创建的 DI 子树的 contextId，然后使用 resolve 方法获取 provider 的实例。此时，resolve 方法会使用当前 DI 子树的 contextId，而不是创建一个新的 DI 子树。进而实现需求。

```ts
@Injectable()
export class CatsService {
  constructor(@Inject(REQUEST) private request: Record<string, unknown>) {}
}
```

```ts
const contextId = ContextIdFactory.getByRequest(this.request);
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);
```

如果当前 provider 是全局作用域的，他会在程序初始化时实例化。其无法获取请求时的信息，如请求对象。所以无法实现。

那如果我们需要动态实例化一个没有注册为 provider 的类，可以使用 ModuleRef.create 方法。

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
```

### 懒加载模块

默认情况下，一旦应用程序加载，所有的模块都会加载，无论它们是否立即需要。虽然这对大多数应用程序来说都没问题，但对于在无服务器环境中运行的应用程序/工作器来说，可能会成为瓶颈，因为启动延迟（"冷启动"）是至关重要的。

Nest 通过 LazyModuleLoader 类实现模块的懒加载。

它可以按照一般的方式注入到类中：

```ts
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

或者可以在 main.ts 中获取 LazyModuleLoader 实例。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const lazyModuleLoader = app.get(LazyModuleLoader);
  // ...
}
bootstrap();
```

然后就可以使用 LazyModuleLoader 实例的 load 方法加载模块。

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

注意，懒加载的模块在第一次加载以后就会被缓存。所以第二次加载时，不会再次加载。

load 方法返回的模块的引用，可以通过 moduleRef.get 方法获取模块中的 provider。

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

const { LazyService } = await import("./lazy.service");
const lazyService = moduleRef.get(LazyService);
```

注意，懒加载模块只能用于访问其 provider，但 controller 无法正常工作。因为路由是在程序启动时注册的，懒加载模块的 controller 不会被注册。所以通常懒加载模块中只包含 provider。

注意，需要设置 tsconfig.json 的 module 和 moduleResolution 字段才能正常使用懒加载。

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

### 执行上下文

Nest 提供了一些使用的类，用于访问当前执行上下文的信息。

#### ArgumentsHost

ArgumentsHost 类提供了获取传递给请求处理方法的参数的方法。在不同的环境下（如 HTTP、RPC、WebSockets、graphql）会传递不同的参数，所以想要获取这些参数，首先要为 ArgumentsHost 实例指定不同的环境。Nest 会在可能需要的地方提供 ArgumentsHost 实例，通常作为函数的参数存在。即不能主动获取。如异常过滤器的 catch 方法存在一个参数为 ArgumentsHost 实例。

```ts
import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 选择 HTTP 环境
    const request = ctx.getRequest(); // 获取请求对象
    const response = ctx.getResponse(); // 获取响应对象

    // ...
  }
}
```

在创建用于多个环境中运行的通用守卫、拦截器和过滤器时，可以通过 ArgumentsHost.getType 方法获取当前的环境，进而分别处理。

```ts
const type = host.getType();
if (type === "http") {
  // ...
} else if (type === "rpc") {
  // ...
} else if (type === "ws") {
  // ...
}
```

获取参数：

在 HTTP 环境下，ArgumentsHost 实例封装了 `[request、response、next]` 数组；在 GraphQl 环境下，实例封装了 `[root、args、context、info]` 数组。

首先要使用 ArgumentsHost.switchToHttp、ArgumentsHost.switchToRpc、ArgumentsHost.switchToWs、ArgumentsHost.switchToGraphql 方法获取特定特定的上下文对象，然后通过这个上下文对象获取参数。

```ts
const ctx = host.switchToHttp(); // 选择 HTTP 环境
const request = ctx.getRequest(); // 获取请求对象
const response = ctx.getResponse(); // 获取响应对象
```

#### ExecutionContext

ExecutionContext 类继承自 ArgumentsHost 类，提供了关于当前执行过程的额外信息。它也不能主动获取，Nest 会在需要的地方作为函数的参数存在。如守卫的 canActive 方法和拦截器的 intercept 方法。

ExecutionContext 类提供了 getHandler 方法获取当前请求处理方法的引用；getClass 方法获取当前请求处理方法所在的类的类型。

这两个数据的重要作用就是，可以通过这两个数据获取添加到函数或类上的元数据。装饰器的作用就是在函数和类上添加元数据，而我们需要获取函数和类上的元数据再进行特定的操作，获取元数据的操作就需要这两个数据的参与。

使用 Reflector#createDecorator 方法可以创建一个装饰器。

```ts
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>(); // 创建一个装饰器
```

绑定到请求处理方法上。

```ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

在导航守卫中获取元数据，就能根据元数据进行操作。

get 方法的第一个参数是装饰器，第二个参数是装饰器所在的请求处理方法的引用。

```ts
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {} // 注入 Reflector 实例
  canActive(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (roles.includes("admin")) {
      return true;
    }
    // ...
  }
}
```

也可以将装饰器添加到 controller 上：

```ts
@Roles(["admin"])
@Controller("cats")
export class CatsController {}
```

获取元数据时，就要使用 getClass 方法获取当前请求处理方法所在的类的类型。

```ts
const roles = this.reflector.get(Roles, context.getClass());
```

如果需要在 controller 和其处理方法上都添加装饰器，可以使用 Reflector.getAllAndOverride 方法获取所有的元数据并后者覆盖前者；使用 Reflector.getAllAndMerge 方法获取所有的元数据并合并。

getAllAndOverride 方法获取的元数据中，后者覆盖前者，那直接获取后者不完了？可以用于需要前者作为默认值出现的情况。如果没有提供后者，就使用前者。

```ts
@Roles(["user"])
@Controller("cats")
export class CatsController {
  @Post()
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
```

```ts
const roles = this.reflector.getAllAndOverride(Roles, [
  context.getHandler(),
  context.getClass(),
]); // ['admin']
```

```ts
const roles = this.reflector.getAllAndMerge(Roles, [
  context.getHandler(),
  context.getClass(),
]); // ['user', 'admin']
```

也可以使用 @SetMetadata 装饰器为类和方法添加元数据。相对于前者可以接受多余一个的参数。

```ts
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

获取元数据时，Reflector.get 方法的第一个参数变成了元数据的键。

```ts
const roles = this.reflector.get<string[]>("roles", context.getHandler());
```

### 生命周期

Nest 应用程序以及每个应用程序元素（模块，provider，controller 等）都有一个由 Nest 管理的生命周期。Nest 提供了生命周期钩子，允许你在特定的生命周期事件中执行代码。

可以在应用程序和应用程序元素上注册这些生命周期钩子，Nest 会在对应的生命周期事件时调用这些钩子。

- onModuleInit：在模块的依赖项被解析后调用。即模块初始化后调用。
- onApplicationBootstrap：在所有模块都已初始化，但在开始监听连接之前被调用。
- onModuleDestroy：在接收到终止信号（例如，SIGTERM）后调用。
- beforeApplicationShutdown：在所有 onModuleDestroy() 处理程序完成（Promise 解析或拒绝）后，会调用 beforeApplicationShutdown 方法；一旦完成（Promise 解析或拒绝），所有现有的连接将被关闭（调用 app.close()）。
- onApplicationShutdown：在连接关闭（app.close() 解析）后调用。

后三者只有在手动调用了 app.close() 方法后，或者手动调用了 app.enableShutdownHooks 方法并且接收到特殊的系统信号（如 SIGTERM）后才会被触发。

注意，以上的生命周期钩子不会触发在请求作用域的类上，因为其不与应用程序的生命周期绑定，他们在请求到来时实例化，请求结束后销毁。

注意，onModuleInit() 和 onApplicationBootstrap() 的执行顺序直接取决于模块导入的顺序，等待前一个钩子。这意味着，如果你的模块 A 导入了模块 B，那么模块 B 的 onModuleInit() 和 onApplicationBootstrap() 方法将在模块 A 的相应方法之前执行。

提示，声明周期钩子也支持声明为异步函数。

为 provider 声明一个 onModuleInit 钩子，他会在 provider 所在的模块初始化后调用。provider 需要实现 OnModuleInit 接口。

```ts
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class UsersService implements OnModuleInit {
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
```

onModuleDestroy()、beforeApplicationShutdown() 和 onApplicationShutdown() 钩子在终止阶段被调用（需要设置）。这个特性经常与 Kubernetes 一起使用，以管理容器的生命周期，或者由 Heroku 用于 dynos 或类似的服务。

如果你通过监听特殊的系统信号来启用这些钩子，你需要使用 app.enableShutdownHooks() 方法启动监听器，但其会消耗系统资源，所以它们默认是禁用的。

### 测试

#### 单元测试

Nest 提供了开箱即用的 Jest 和 Supertest，用于编写单元测试和集成测试。还需要安装额外的 @nestjs/testing 包，它提供了模拟完整的 Nest 运行时环境的工具。

```ts
import { Test } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result = ["test"];
      jest.spyOn(catsService, "findAll").mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
```

Test.createTestingModule 方法创建一个测试模块，其接受一个模块元数据对象作为其参数，就是传给 @Module 装饰器的对象。调用 compiler 方法后返回一个 TestingModule 实例。

可以使用 TestingModule 实例的 get 方法获取全局作用域的 provider 的实例。也可以使用 resolve 方法获取请求和瞬态作用域的 provider 的实例。就像之前的 ModuleRef 实例一样。这样会尽可能地模拟真实的 Nest 运行时环境。

获取到实例之后，就可以进行测试了。

#### mock

在创建 TestingModule 时，可以结合 useMocker 方法，实现模拟一个 provider ，而不是使用真实的 provider。

useMocker 方法接受一个工厂函数，接受一个 token 参数，需要返回 provider 的模拟实例。每次使用 TestingModule.get/resolve 方法获取 provider 时，都会调用这个工厂函数，参数也会成为工厂函数的 token。

在这个例子中，如果 token 为 CatsService，那就返回一个包含 findAll 方法的对象，其返回值为 ['test1', 'test2']。而当你使用其他的类时（类也是函数），就会调用 ModuleMocker.getMetadata 方法获取这个类的元数据，然后调用 ModuleMocker.generateFromMetadata 方法生成一个模拟实例。即我们为 CatsService 提供了一个模拟实例，并使用了 jest-mock 方法生成了一个通用的模拟实例。

```ts
// cats.controller.spec.ts 注意测试文件命名
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe("CatsController", () => {
  let controller: CatsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
    })
      .useMocker((token) => {
        const results = ["test1", "test2"];
        if (token === CatsService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(CatsController);
  });
});
```

#### 端到端测试

与关注于单个的模块和类的单元测试不同，端到端测试覆盖了类和模块在更接近用户与生产环境下的程序的交互行为的测试。

在单元测试中，我们使用 TestingModule 直接获取了 provider 。在下面的例子中，我们使用 createNestApplication 方法实例化一个完整的 Nest 运行时环境，并保存在变量 app 中。

我们使用 Supertest 的 request() 函数模拟 HTTP 测试。传给 request 函数一个参数：Nest 应用的 HTTP 监听器。这样这个请求就会路由到 app 中，并断言状态码和响应体。

我们还使用了 overrideProvider 方法，用于替换 CatsService 的实现，相似的还有 overrideModule()、overrideGuard()、overrideInterceptor()、overrideFilter() 和 overridePipe() 方法覆盖模块、守卫、拦截器、过滤器和管道。

- 每个方法都接受一个令牌作为参数，之后的调用的 useValue 方法就会覆盖这个令牌的实现。
- 每个方法（除了 overrideModule）都返回一个对象，包含三种提供替代实现的方法：useValue、useClass 和 useFactory，和自定义 provider 中一样。这里我们就使用了 useValue 直接提供了一个替代实现。
- 对于 overrideModule 方法，其返回一个包含 useModule 方法的对象，我们调用 useModule 方法传入一个模块元数据对象，就可以替换模块的实现。

```ts
// cats.e2e-spec.ts 注意测试文件命名
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { CatsModule } from "../../src/cats/cats.module";
import { CatsService } from "../../src/cats/cats.service";
import { INestApplication } from "@nestjs/common";

describe("Cats", () => {
  let app: INestApplication;
  let catsService = { findAll: () => ["test"] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get("/cats").expect(200).expect({
      data: catsService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

#### 测试请求作用域的实例

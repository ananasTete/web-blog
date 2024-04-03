NestJS 是一个基于 ExpressJS 的 HTTP 服务框架（可选 FastifyJS），但也直接向开发者暴露出他们的 API，以便于使用他们的第三方模块。

对于其他 NodeJS 的 HTTP 框架，NestJS 提供了开箱即用的架构能力。这个能力具体是指什么？

可以安装 @nestjs/cli 来创建一个 NestJS 项目，他默认启用 TS。项目中还包含了其他配置，如 prettier、eslint、jest 等。

```shell
pnpm add @nestjs/cli

nest new project-name

# --strict 选项会在项目中启用 TS 的严格模式
nest new project-name --strict
```

使用 NestFactory 类的静态方法 create 创建一个应用实例，并设置监听端口。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

NestJS 使用 ExpressJS 还是 fastify 作为 HTTP 服务框架，取决于你的配置。他们都是通过适配器实现的。如 @nestjs/platform-express 提供了 express 的适配器，@nestjs/platform-fastify 提供了 fastify 的适配器。理论上说，只要有对应的适配器，NestJS 可以支持任何 HTTP 服务框架。上面的代码中，我们使用了默认的 express 适配器。如果要使用 fastify 适配器，可以这样：

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

控制器负责处理请求，并向其客户端返回响应。

一个控制器可以包含多个路由，所以一般一个控制器用于定义一个模块的多个 API。

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

findAll 方法中可以通过装饰器拿到请求体、请求头、请求参数等信息。如使用 @Body 获取请求体；使用 @Req() 装饰器来获取底层框架 Express 的请求对象。注意，底层框架的请求对象的类型需要由 @types/express 提供。还可以通过 @Res 拿到响应对象用来设置响应体。但是不推荐这种直接访问底层框架的 API 的方式，因为这样会降低 NestJS 程序的可移植性，不能用其他底层框架了。所以大多数情况下，使用 @Body 和 @Query 等 NestJS 提供的装饰器就够了。

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

![可用的请求体装饰器](../../public//framework//nest/index-1.png)

注意，请求体的类型可以使用接口或类来声明，但 NestJS 建议使用类。因为在讲 TS 编译为 JS 之后，接口会被完全删除，而类会被保留下来。NestJS 中有一些特性如管道、拦截器、守卫等，这些特性需要在 **运行时** 使用类的元数据。所以使用类更好。

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

### Providers 服务

providers 是什么？

Providers 是用来实现各种功能的类，他需要使用 @InJectable() 装饰器。他的特点是通过依赖注入的模式来访问，而不是在使用时创建一个新的实例。它是 Nest 中实现解耦和模块化的关键工具。

这种方式与创建新的实例有什么区别？

当程序启动时，所有的依赖都会被解析，此时所有的 Provider 都会被实例化并存储在依赖注入容器中。这样其他地方通过依赖注入访问 CatsService 时，都会使用存储的实例。这样可以避免在多个地方创建多个实例，保证了实例的唯一性。也就是说所有用它的地方访问的都是一个实例。

为什么需要 providers?

创建可重用的服务：你可以将一些常用的功能封装在一个服务中，然后在需要的地方注入这个服务。这样，你可以避免在多个地方重复相同的代码，使你的代码更易于维护。

实现模块化：在 Nest 中，每个模块都可以提供一些提供者，这些提供者只在这个模块中可用。这样，你可以将你的应用分割为多个模块，每个模块负责一部分功能，使你的代码更易于理解和管理。

为什么要使用依赖注入模式？

实现解耦：通过依赖注入，你可以降低你的代码之间的耦合度。例如，如果一个类需要使用另一个类的功能，你不需要在这个类中直接创建那个类的实例，而是可以通过依赖注入来获取那个类的实例。这样，如果那个类的实现发生了变化，你只需要修改那个类，而不需要修改使用那个类的所有地方。

提高测试性：通过依赖注入，你可以在测试时替换真实的依赖为模拟的依赖。这样，你可以在不影响其他代码的情况下测试你的代码，使你的测试更容易编写和执行。

:::tip
NestJS 内部广泛应用了依赖注入这种设计模式，所以你需要再多个地方使用一个实例即可时，可以为参数传递一个类，当你需要特定的实例或实例化时，可以传递一个新的实例。这都是可以兼容处理的。
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

在 Module 中注册这个 provider：

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

在 CatsController 中通过依赖注入使用这个 provider，而不是在构造函数中创建一个新的 CatsService 实例。

```ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

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

如果需要一个特定的实例，而不是共享的 provider 实例呢？

如果你需要一个特定的实例，你可以使用 @Injectable({ scope: Scope.REQUEST }) 装饰器来指定作用域。这样，每个请求都会创建一个新的实例。

```ts
@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  // ...
}
```

如果在实例化类时需要传入一些参数怎么办？？

### Modules 模块

模块是一个使用 @Module() 装饰器注解的类。

每个应用程序至少有一个模块，即根模块。根模块是 Nest 用来构建应用程序图的起点。

每个模块都可以通过 @Module() 装饰器来定义一些元数据。

```ts
@Module({
  imports: [], // 导入其他模块，这些模块导出的 provider 将在本模块中可用
  controllers: [], // 本模块的控制器列表
  providers: [], // 本模块的 Provider 列表，可以注册本模块的 Provider 也注册其他模块的 Provider
  exports: [], // 本模块想要导出的提供者列表，这些提供者可以被其他模块注入
})
export class AppModule {}
```

通常一组特定的功能可以封装为一个模块，模块间可以相互引用，注册并使用其他模块暴露出的 Provider。并且模块最终被根模块引用。形成一个树结构。

exports 参数还可以导出它自身导入的模块。即 exports 既可以导出自身的 Provider 也可以导出它导入的 Module。注意，不是导出它导入的 Module 的 Provide，而是 Module 本身。

模块本身只负责注册 Controller 和 Provider，和导入导出吗？

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

### middleware 中间件

中间件是一个在路由处理函数之前执行的函数。它可以获取请求和响应对象和下一个中间件函数。可以用于修改请求对象，记录请求，验证用户身份，结束请求，处理请求数据等操作。

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

我们通过类实现一个中间件，他需要实现 NestMiddleware 接口，并实现 use 方法。use 方法接受三个参数，分别是请求对象、响应对象和下一个中间件函数。在 use 方法中，我们可以对请求对象和响应对象进行操作，也可以调用 next() 方法调用下一个中间件。

因为我们使用了 @Injectable z 装饰器，它可以方便的注入其他 Provider 来实现更多功能。

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

也就是说，当你抛出一个 HttpException 时，Nest 会自动将其转换为一个标准的 HTTP 响应。**可以用这种方式根据条件返回不同的响应，而不是某种固定的响应。**

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

@Catch 装饰器的参数接受一个类型，这个过滤器会捕获指定类型的异常。不传参数时，会捕获所有类型的异常。

需要在这个 catch 方法中使用底层平台的 request 和 response 方法自定义处理逻辑，并最终使用 response 设置一个像一个对象。

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

### pipes 管道

管道一种使用 @Injectable 装饰器注解的类，他需要实现实现 PipeTransform 接口。

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

Nest 内置了一些管道，如 ParseIntPipe、ValidationPipe、ParseArrayPipe、ParseBoolPipe、ParseUUIDPipe、ParseEnum 等。

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

ParseIntPipe 会将 id 转换为一个整数。如果 id 不可以被转换为整数，会抛出一个 BadRequestException 异常。被异常过滤器捕获后返回相应的响应给客户端。

#### 自定义管道

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

声明拦截器：

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

绑定拦截器

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
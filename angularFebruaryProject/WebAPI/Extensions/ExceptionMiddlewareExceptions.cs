using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using WebAPI.Middlewares;

namespace WebAPI.Extensions
{
  public static class ExceptionMiddlewareExceptions
  {
    public static void ConfigureExceptionHandler(this IApplicationBuilder app,
    IWebHostEnvironment env)
    {
      app.UseMiddleware<ExceptionMiddleware>();
    }
    public static void ConfigureExceptionBuiltinHandler(this IApplicationBuilder app,
    IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseSwagger();
        app.UseSwaggerUI();
      }

      else
      {
        app.UseExceptionHandler(
          options =>
          {
            options.Run(
              async context =>
              {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var ex = context.Features.Get<IExceptionHandlerFeature>();
                if (ex != null)
                {
                  await context.Response.WriteAsync(ex.Error.Message);
                }
              }
            );
          }
        );
      }
    }
  }
}

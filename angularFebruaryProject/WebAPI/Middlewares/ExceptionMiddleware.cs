using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WebAPI.Errors;

namespace WebAPI.Middlewares
{
  public class ExceptionMiddleware
  {
    private readonly RequestDelegate next;
    private readonly IHostEnvironment env;

    public ILogger<ExceptionMiddleware> logger { get; }
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
                              IHostEnvironment env)
    {
      this.logger = logger;
      this.env = env;
      this.next = next;
    }

    public async Task Invoke(HttpContext context)
    {
      try
      {
        await next(context);
      }
      catch (Exception ex)
      {
        ApiError response;
        HttpStatusCode statusCode=HttpStatusCode.InternalServerError;

        String message;
        var exceptionType=ex.GetType();
        if(exceptionType==typeof(UnauthorizedAccessException))
        {
          statusCode=HttpStatusCode.Forbidden;
          message="you are not authorized";
        }
        else
        {
          statusCode=HttpStatusCode.InternalServerError;
          message="some unknown error occoured";
        }

        if(env.IsDevelopment())
        {
          response=new ApiError((int)statusCode, ex.Message, ex.StackTrace.ToString());
        }
        else
        {
          response=new ApiError((int)statusCode, message);
        }

        logger.LogError(ex, ex.Message);
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType="application/json";
        await context.Response.WriteAsync(response.ToString());
      }
    }
  }
}

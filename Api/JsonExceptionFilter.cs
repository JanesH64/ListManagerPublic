using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using static System.Net.HttpStatusCode;

namespace Api
{
    public class JsonExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<JsonExceptionFilter> _logger;
        public JsonExceptionFilter(ILogger<JsonExceptionFilter> logger)
        {
            _logger = logger;
        }
        public void OnException(ExceptionContext context)
        {
            ObjectResult result;
            if (context.Exception.GetType() == typeof(ArgumentException)
                || context.Exception.GetType() == typeof(FormatException)
                || context.Exception.GetType() == typeof(BsonSerializationException))
            {
                result = new ObjectResult(new
                {
                    code = BadRequest,
                    message = nameof(BadRequest),
                    detailedMessage = context.Exception.Message
                })
                {
                    StatusCode = (int)BadRequest
                };

                context.Result = result;
                return;
            }
            if (context.Exception.GetType() == typeof(KeyNotFoundException))
            {
                result = new ObjectResult(new
                {
                    code = NotFound,
                    message = nameof(NotFound),
                    detailedMessage = context.Exception.Message
                })
                {
                    StatusCode = (int)NotFound
                };

                context.Result = result;
                return;
            }
            result = new ObjectResult(new
            {
                code = InternalServerError,
                message = nameof(InternalServerError),
                detailedMessage = context.Exception.Message
            })
            {
                StatusCode = (int)InternalServerError
            };
            context.Result = result;
            _logger.LogError($"Exception of type '{context.Exception.GetType()}' was thrown for {context.HttpContext.Request.Method} '{context.HttpContext.Request.Path}', 500 was returned.", context.Exception);
        }
    }
}
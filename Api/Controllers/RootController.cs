using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Api.Controllers
{
    [ApiController]
    [Route("")]
    public class RootController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RootController(ILogger<RootController> logger, IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult GetCategories()
        {
            return new ObjectResult(new
            {
                Environment = _configuration["ASPNETCORE_ENVIRONMENT"],
            });
        }
    }
}

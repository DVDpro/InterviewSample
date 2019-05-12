using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular.Controllers
{
    [Route("api/[controller]")]
    public class ConfigurationController : ControllerBase
    {
        public ConfigurationController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // GET api/Configuration
        [HttpGet]
        public ActionResult<Models.ConfigurationModel> Get()
        {
            return new Models.ConfigurationModel
            {
                GateUrl = Configuration[nameof(Models.ConfigurationModel.GateUrl)],
                IdentityServiceUrl = Configuration[nameof(Models.ConfigurationModel.IdentityServiceUrl)]
            };
        }
    }
}

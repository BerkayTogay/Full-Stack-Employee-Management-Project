using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
//using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenderController : ControllerBase
    {
        public GenderController()
        {
        }

        [HttpGet("")]
        public IEnumerable<string> GetTModels()
        {
            return new string[] {"female","male"};
        }
    }
}

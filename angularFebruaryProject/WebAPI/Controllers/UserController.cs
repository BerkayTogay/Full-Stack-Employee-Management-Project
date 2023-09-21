using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
  public class UserController : BaseController
  {
    private readonly IUnitOfWork uow;
    private readonly IConfiguration configuration;

    public UserController(IUnitOfWork uow, IConfiguration configuration)
    {
      this.uow = uow;
      this.configuration = configuration;
    }

    //api/user/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginReqDto loginReqDto)
    {
      var user=uow.UserRepository.Authenticate(loginReqDto.UserName, loginReqDto.Password);
      if(user==null)
      {
        return Unauthorized();
      }

      //login response -- when user logged in, what should logged page returns us, we are editing it here (a token)
      var loginRes=new LoginResDto();
      loginRes.UserName=loginReqDto.UserName; // it must change to user.UserName
      loginRes.Token=CreateJWT(await user);
      return Ok(loginRes);
    }

    //api/user/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(LoginReqDto loginReqDto)
    {
      if(await uow.UserRepository.UserAlreadyExists(loginReqDto.UserName))
      {
        return BadRequest("user already exists, try something else");
      }

      uow.UserRepository.Register(loginReqDto.UserName,loginReqDto.Password);
      await uow.SaveAsync();
      return StatusCode(201);
    }

    private string CreateJWT(User user)
    {
      var secretKey=configuration.GetSection("Key").Value;
      var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

      var claims=new Claim[]{
        new Claim(ClaimTypes.Name , user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      };

      var signingCredentials=new SigningCredentials(key,SecurityAlgorithms.HmacSha256Signature);

      var tokenDescriptor=new SecurityTokenDescriptor{
        Subject=new ClaimsIdentity(claims),
        Expires=DateTime.UtcNow.AddDays(10),
        SigningCredentials=signingCredentials
      };

      var tokenHandler=new JwtSecurityTokenHandler();
      var token=tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}

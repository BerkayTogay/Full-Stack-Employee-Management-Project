using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;
//using WebAPI.Models;

namespace WebAPI.Controllers
{

  [Authorize]
  public class CityController : BaseController
  {
    private readonly IUnitOfWork uow;
    private readonly IMapper mapper;

    public CityController(IUnitOfWork uow, IMapper mapper)
    {
      this.uow = uow;
      this.mapper = mapper;
    }

    [HttpGet("cities")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCities()
    {

      var cities = await uow.CityRepository.GetCitiesAsync();
      /* automapping here */
      var citiesDto=mapper.Map<IEnumerable<CityDtos>>(cities);
      /* manually mapping is done, we are automapping after that
      var citiesDto=from c in cities
                    select new CityDtos()
                    {
                      Id=c.Id,
                      Name=c.Name
                    };
      */

      return Ok(citiesDto);
    }

    // [HttpPost("add")]
    // [HttpPost("add/{cityName}")]
    // public async Task<IActionResult> AddCity(string cityName)
    // {
    //   City city=new City();
    //   city.Name=cityName;
    //   await Dc.Cities.AddAsync(city);
    //   await Dc.SaveChangesAsync();
    //   return Ok(city);
    // }

    [HttpPost("post")]
    public async Task<IActionResult> AddCity(CityDtos cityDtos)
    {
      var city=mapper.Map<City>(cityDtos);
      city.LastUpdatedBy=1;
      city.LastUpdatedOn=DateTime.Now;

      /* manually mapping is done, we are automapping after that
      var city=new City{
        Name=cityDtos.Name,
        LastUpdatedBy=1,
        LastUpdatedOn=DateTime.Now
      };
      */

      uow.CityRepository.AddCity(city);
      await uow.SaveAsync();
      return StatusCode(201);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCity(int id, CityDtos cityDtos)
    {
      if(id!=cityDtos.Id)
      {
        return BadRequest("update not allowed");
      }

      var cityFromDb=await uow.CityRepository.FindCity(id);

      if(cityFromDb==null)
      {
        return BadRequest("update not allowed");
      }
      cityFromDb.LastUpdatedBy=1;
      cityFromDb.LastUpdatedOn=DateTime.Now;
      mapper.Map(cityDtos, cityFromDb);

      await uow.SaveAsync();
      return StatusCode(200);
    }

    [HttpPatch("update/{id}")]

    public async Task<IActionResult> UpdateCityPath(int id, JsonPatchDocument<City> cityToPatch)
    {
      var cityFromDb=await uow.CityRepository.FindCity(id);
      cityFromDb.LastUpdatedBy=1;
      cityFromDb.LastUpdatedOn=DateTime.Now;

      cityToPatch.ApplyTo(cityFromDb, ModelState);
      await uow.SaveAsync();
      return StatusCode(200);
    }

    [HttpPatch("updateCityName/{id}")]

    public async Task<IActionResult> UpdateCity(int id, CityUpdateDtos cityUpdateDtos)
    {
      var cityFromDb=await uow.CityRepository.FindCity(id);
      cityFromDb.LastUpdatedBy=1;
      cityFromDb.LastUpdatedOn=DateTime.Now;
      mapper.Map(cityUpdateDtos, cityFromDb);
      await uow.SaveAsync();
      return StatusCode(200);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCity(int id)
    {
      uow.CityRepository.DeleteCity(id);
      await uow.SaveAsync();
      return Ok(id);
    }
  }
}

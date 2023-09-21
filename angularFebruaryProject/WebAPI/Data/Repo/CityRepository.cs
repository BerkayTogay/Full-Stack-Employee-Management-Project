using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
  public class CityRepository : ICityRepository
  {
    private readonly DataContext dc;

    public CityRepository(DataContext Dc)
    {
      dc = Dc;
    }
    public void AddCity(City city)
    {
      dc.Cities.AddAsync(city);
    }

    public void DeleteCity(int id)
    {
      var city=dc.Cities.Find(id);
      dc.Cities.Remove(city);
    }

    public async Task<City> FindCity(int id)
    {
      return await dc.Cities.FindAsync(id);
    }

    public async Task<IEnumerable<City>> GetCitiesAsync()
    {
      return await dc.Cities.ToListAsync();
    }

    // public async Task<bool> SaveAsync()
    // {
    //   return await dc.SaveChangesAsync() > 0 ;
    // }
  }
}

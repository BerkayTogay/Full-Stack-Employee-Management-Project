using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
          //with this line, we only making our mapper city to cityDtos transform but, if we try to make a transform with
          //cityDtos  to city, we must add 'reversing (reverseMap)' to our mapping //
          CreateMap<City, CityDtos>().ReverseMap();

          CreateMap<City, CityUpdateDtos>().ReverseMap();
        }
    }
}

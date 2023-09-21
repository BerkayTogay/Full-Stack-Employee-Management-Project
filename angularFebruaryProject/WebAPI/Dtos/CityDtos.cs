using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class CityDtos
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "name field is required")]
        [StringLength(30, MinimumLength =2)]
        [RegularExpression(".*[a-zA-Z]+.*", ErrorMessage ="only numerics are not allowed")]
        public string Name { get; set; }

        [Required]
        public string Country { get; set; }
    }
}

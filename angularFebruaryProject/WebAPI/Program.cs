using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Data;
using WebAPI.Extensions;
using WebAPI.Helpers;
using WebAPI.Interfaces;
using WebAPI.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options=>options.UseSqlServer(
  builder.Configuration.GetConnectionString("DefaultConnection")
));
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5247")
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
//authentication with jwt starts here
var secretKey=builder.Configuration.GetSection("Key").Value;
var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(opt=>{
  opt.TokenValidationParameters=new TokenValidationParameters
  {
    ValidateIssuerSigningKey=true,
    ValidateIssuer=false,
    ValidateAudience=false,
    IssuerSigningKey=key
  };
});
// jwt authentication ends here //

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.ConfigureExceptionHandler(app.Environment);

//app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x=>x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

//authentication->cors'tan sonra, authorizationdan önce tanımlanmalıdır //
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

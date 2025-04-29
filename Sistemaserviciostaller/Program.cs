using Microsoft.EntityFrameworkCore;
using Sistemaserviciostaller.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var _config = builder.Configuration;
var conexion = _config.GetConnectionString("DevConnection");
builder.Services.AddDbContext<TallervehicularContext>(
    options=>options.UseMySql(conexion, ServerVersion.AutoDetect(conexion)));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

// Controllers/ReportesController.cs
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Sistemaserviciostaller.Data; // Cambiado al namespace real de tu contexto

namespace Sistemaserviciostaller.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly TallervehicularContext _context;

        public ReportesController(TallervehicularContext context)
        {
            _context = context;
        }

        [HttpGet("ordenes-mes")]
        public IActionResult OrdenesPorMes()
        {
    var resultados = _context.Ordenservicio
        .Where(o => o.Fecha.HasValue)
        .GroupBy(o => o.Fecha!.Value.Month) // El "!" le dice al compilador: "esto no será null"
        .Select(g => new
        {
            Mes = g.Key,
            Total = g.Count()
        })
        .ToList();

    return Ok(resultados);
}

        [HttpGet("servicios-mas-solicitados")]
        public IActionResult ServiciosMasSolicitados()
        {
            var resultados = _context.Detalleservicio
                .GroupBy(ds => ds.ServicioId)
                .Select(g => new
                {
                    ServicioId = g.Key,
                    Total = g.Count()
                })
                .OrderByDescending(g => g.Total)
                .Take(6)
                .ToList();

            return Ok(resultados);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sistemaserviciostaller.Data;

namespace Sistemaserviciostaller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiculoesController : ControllerBase
    {
        private readonly TallervehicularContext _context;

        public VehiculoesController(TallervehicularContext context)
        {
            _context = context;
        }

        // GET: api/Vehiculoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehiculo>>> GetVehiculo()
        {
            return await _context.Vehiculo
             .Include(v => v.Cliente) // Esto carga los datos del cliente
                .Include(v => v.Marca) // Esto carga los datos de la marca
                .Include(v => v.Modelo) // Esto carga los datos del modelo
                
            .ToListAsync();
        }

        // GET: api/Vehiculoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehiculo>> GetVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculo.FindAsync(id);

            if (vehiculo == null)
            {
                return NotFound();
            }

            return vehiculo;
        }

        // PUT: api/Vehiculoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehiculo(int id, Vehiculo vehiculo)
        {
            if (id != vehiculo.Id)
            {
                return BadRequest();
            }

            _context.Entry(vehiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehiculoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Vehiculoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vehiculo>> PostVehiculo(Vehiculo vehiculo)
        {
            _context.Vehiculo.Add(vehiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehiculo", new { id = vehiculo.Id }, vehiculo);
        }

        // DELETE: api/Vehiculoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculo.FindAsync(id);
            if (vehiculo == null)
            {
                return NotFound();
            }

            _context.Vehiculo.Remove(vehiculo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Buscar por placa
        [HttpGet("buscar/placa/{placa}")]
        public async Task<IActionResult> BuscarPorPlaca(string placa)
        {
            var vehiculos = await _context.Vehiculo
                .Include(v => v.Cliente)
                .Where(v => v.Placa != null && v.Placa.ToLower().Contains(placa.ToLower()))
                .ToListAsync();

            if (vehiculos == null || vehiculos.Count == 0)
                return NotFound();

            return Ok(vehiculos);
        }

        // Buscar por cliente
        [HttpGet("buscar/cliente/{cliente}")]
        public async Task<IActionResult> BuscarPorCliente(string cliente)
        {
            var vehiculos = await _context.Vehiculo
                .Include(v => v.Cliente)
                .Where(v => v.Cliente != null && v.Cliente.Nombre != null && v.Cliente.Nombre.ToLower().Contains(cliente.ToLower()))
                .ToListAsync();

            if (vehiculos == null || vehiculos.Count == 0)
                return NotFound();

            return Ok(vehiculos);
        }

        private bool VehiculoExists(int id)
        {
            return _context.Vehiculo.Any(e => e.Id == id);
        }
    }
}

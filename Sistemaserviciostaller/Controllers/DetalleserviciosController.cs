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
    public class DetalleserviciosController : ControllerBase
    {
        private readonly TallervehicularContext _context;

        public DetalleserviciosController(TallervehicularContext context)
        {
            _context = context;
        }

        // GET: api/Detalleservicios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalleservicio>>> GetDetalleservicio()
        {
            return await _context.Detalleservicio.ToListAsync();
        }

        // GET: api/Detalleservicios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Detalleservicio>> GetDetalleservicio(int id)
        {
            var detalleservicio = await _context.Detalleservicio.FindAsync(id);

            if (detalleservicio == null)
            {
                return NotFound();
            }

            return detalleservicio;
        }

        // PUT: api/Detalleservicios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleservicio(int id, Detalleservicio detalleservicio)
        {
            if (id != detalleservicio.Id)
            {
                return BadRequest();
            }

            _context.Entry(detalleservicio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleservicioExists(id))
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

        // POST: api/Detalleservicios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Detalleservicio>> PostDetalleservicio(Detalleservicio detalleservicio)
        {
            _context.Detalleservicio.Add(detalleservicio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleservicio", new { id = detalleservicio.Id }, detalleservicio);
        }

        // DELETE: api/Detalleservicios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleservicio(int id)
        {
            var detalleservicio = await _context.Detalleservicio.FindAsync(id);
            if (detalleservicio == null)
            {
                return NotFound();
            }

            _context.Detalleservicio.Remove(detalleservicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleservicioExists(int id)
        {
            return _context.Detalleservicio.Any(e => e.Id == id);
        }
    }
}

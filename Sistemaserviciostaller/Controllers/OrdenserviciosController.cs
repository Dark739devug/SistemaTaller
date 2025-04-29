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
    public class OrdenserviciosController : ControllerBase
    {
        private readonly TallervehicularContext _context;

        public OrdenserviciosController(TallervehicularContext context)
        {
            _context = context;
        }

        // GET: api/Ordenservicios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ordenservicio>>> GetOrdenservicio()
        {
            return await _context.Ordenservicio.ToListAsync();
        }

        // GET: api/Ordenservicios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ordenservicio>> GetOrdenservicio(int id)
        {
            var ordenservicio = await _context.Ordenservicio.FindAsync(id);

            if (ordenservicio == null)
            {
                return NotFound();
            }

            return ordenservicio;
        }

        // PUT: api/Ordenservicios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrdenservicio(int id, Ordenservicio ordenservicio)
        {
            if (id != ordenservicio.Id)
            {
                return BadRequest();
            }

            _context.Entry(ordenservicio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrdenservicioExists(id))
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

        // POST: api/Ordenservicios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Ordenservicio>> PostOrdenservicio(Ordenservicio ordenservicio)
        {
            _context.Ordenservicio.Add(ordenservicio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrdenservicio", new { id = ordenservicio.Id }, ordenservicio);
        }

        // DELETE: api/Ordenservicios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrdenservicio(int id)
        {
            var ordenservicio = await _context.Ordenservicio.FindAsync(id);
            if (ordenservicio == null)
            {
                return NotFound();
            }

            _context.Ordenservicio.Remove(ordenservicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrdenservicioExists(int id)
        {
            return _context.Ordenservicio.Any(e => e.Id == id);
        }
    }
}

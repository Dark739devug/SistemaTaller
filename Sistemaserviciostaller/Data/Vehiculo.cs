using System;
using System.Collections.Generic;

namespace Sistemaserviciostaller.Data;

public partial class Vehiculo
{
    public int Id { get; set; }

    public int? ClienteId { get; set; }

    public string? Marca { get; set; }

    public string? Modelo { get; set; }

    public int? Año { get; set; }

    public string? Placa { get; set; }

    public virtual Cliente? Cliente { get; set; }

    public int? EmpleadoId { get; set; } // Nuevo campo

   public virtual Empleado? Empleado { get; set; } // Relación
    
    public virtual ICollection<Ordenservicio> Ordenservicio { get; set; } = new List<Ordenservicio>();
}

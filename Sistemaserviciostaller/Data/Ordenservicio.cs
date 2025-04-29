using System;
using System.Collections.Generic;

namespace Sistemaserviciostaller.Data;

public partial class Ordenservicio
{
    public int Id { get; set; }

    public int? VehiculoId { get; set; }

    public DateOnly? Fecha { get; set; }

    public string? Estado { get; set; }

    public virtual ICollection<Detalleservicio> Detalleservicio { get; set; } = new List<Detalleservicio>();

    public virtual Vehiculo? Vehiculo { get; set; }
}

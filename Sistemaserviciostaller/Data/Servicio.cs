using System;
using System.Collections.Generic;

namespace Sistemaserviciostaller.Data;

public partial class Servicio
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public decimal? Precio { get; set; }

    public virtual ICollection<Detalleservicio> Detalleservicio { get; set; } = new List<Detalleservicio>();
}

using System;
using System.Collections.Generic;

namespace Sistemaserviciostaller.Data;

public partial class Detalleservicio
{
    public int Id { get; set; }

    public int? OrdenServicioId { get; set; }

    public int? ServicioId { get; set; }

    public int? EmpleadoId { get; set; }

    public string? Comentarios { get; set; }

    public virtual Empleado? Empleado { get; set; }

    public virtual Ordenservicio? OrdenServicio { get; set; }

    public virtual Servicio? Servicio { get; set; }
}
